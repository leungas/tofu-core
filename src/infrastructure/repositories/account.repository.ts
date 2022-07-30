import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Account } from 'src/domain/entities/account.entity';
import { User } from 'src/domain/entities/user.entity';
import { Workspace } from 'src/domain/entities/workspace.entity';
import { EntityManager, FindManyOptions } from 'typeorm';
import { AccountModel } from '../models/account.model.';
import { MemberModel } from '../models/member.model';
import { SystemTeamModel } from '../models/system-team.model';
import { TeamModel } from '../models/team.model';
import { UserModel } from '../models/user.model';
import { WorkspaceModel } from '../models/workspace.model';

/**
 * @class
 * @name AccountModelRepository
 * @description The data access logic for the account
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class AccountModelRepository {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description the logger for console
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger('repo[account]', {
    timestamp: true,
  });

  /**
   * @constructor
   * @param client {EntityManager} the client connection
   */
  constructor(
    @InjectEntityManager()
    private readonly client: EntityManager,
  ) {}

  /**
   * @method convert
   * @param entity {Account} the entity to convert
   * @returns {Promise<AccountModel>}
   */
  convert(entity: Account) {
    this.logger.debug(`convert(): Enter`);
    this.logger.debug(`convert(): $entity = ${JSON.stringify(entity)}`);
    return Object.assign(new AccountModel(), entity);
  }

  /**
   * @async
   * @method create
   * @description Creating a new instance of account
   * @param entity {Account} the data received
   * @returns {Promise<Account>}
   */
  async create(entity: Workspace, admin: User) {
    this.logger.debug(`create(): Enter`);
    this.logger.debug(`create(): $entity = ${JSON.stringify(entity)}`);
    const result = await this.client.transaction(async (m) => {
      const account = await m.save(this.convert(entity.account));
      this.logger.debug(`create(): $account = ${JSON.stringify(account)}`);
      let user = await m.findOne(UserModel, { where: { id: admin.id } });
      this.logger.debug(`create(): $user = ${JSON.stringify(user)}`);
      if (!user) user = await m.save(Object.assign(new UserModel(), admin));
      const workspace = await m.save(
        Object.assign(new WorkspaceModel(), entity, {
          account: account,
          admin: user,
        }),
      );
      this.logger.debug(`create(): $workspace = ${JSON.stringify(workspace)}`);
      const roles = await m.find(SystemTeamModel);
      this.logger.debug(`create(): $roles = ${JSON.stringify(roles)}`);
      const teams = roles.map((r: SystemTeamModel) => {
        const team = Object.assign(new TeamModel(), r, { owner: workspace });
        if (r.autoAssign) {
          const member = Object.assign(new MemberModel(), {
            team: team,
            user: user,
          });
          team.members.push(member);
        }
        this.logger.debug(`create(): $team = ${JSON.stringify(team)}`);
        return team;
      });

      await m.save(teams);
      return account;
    });
    return result;
  }

  /**
   * @async
   * @method createSolo
   * @description creating an account on its own - not used outside repo level
   * @param entity {Account} the account to create
   * @returns {Promise<void>}
   */
  async createSolo(entity: Account) {
    this.logger.debug(`createSolo(): Enter`);
    this.logger.debug(`createSolo(): $entity = ${JSON.stringify(entity)}`);
    const model = Object.assign(new AccountModel(), entity);
    await this.client.save(model);
  }

  /**
   * @async
   * @method get
   * @description Loading a single account
   * @param id {string} the account id
   * @returns {Promose<Account>}
   */
  get(id: string) {
    this.logger.debug(`get(): Enter`);
    this.logger.debug(`get(): $id = ${id}`);
    return this.client.findOne(AccountModel, { where: { id: id } });
  }

  /**
   * @async
   * @method remove
   * @description removing an existing instance of account
   * @param entity {Account} the instance to remove
   * @returns {Promose<void>}
   */
  async remove(entity: Account) {
    this.logger.debug(`remove(): Enter`);
    this.logger.debug(`remove(): $entity = ${JSON.stringify(entity)}`);
    const model = await this.get(entity.id);
    this.logger.debug(`remove(): $model = ${JSON.stringify(model)}`);
    if (!model) throw new NotFoundException();
    return this.client.remove(model);
  }

  /**
   * @async
   * @method search
   * @description listing instances that matching the filter
   * @param filter {FindManyOptions<AccountModel>} filter to search
   * @returns {Promise<AccountModel[]>}
   */
  async search(filter: FindManyOptions<AccountModel>) {
    this.logger.debug(`search(): Enter`);
    this.logger.debug(`search(): $filter = ${JSON.stringify(filter)}`);
    return this.client.find(AccountModel, filter);
  }

  /**
   * @async
   * @method update
   * @description Updating an existing account
   * @param entity {Account} update an existing account
   * @returns {Promise<AccountModel>}
   */
  async update(entity: Account) {
    this.logger.debug(`update(): Enter`);
    this.logger.debug(`update(): $entity = ${JSON.stringify(entity)}`);
    const model = await this.get(entity.id);
    this.logger.debug(`update(): $model = ${JSON.stringify(model)}`);
    if (!model) throw new NotFoundException();
    const mutation = Object.assign(model, entity);
    return this.client.save(mutation);
  }
}
