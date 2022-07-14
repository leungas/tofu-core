import {
  Injectable,
  Logger,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
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
 * @name WorkspaceModelRepository
 * @description The data access for the workspace data model
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class WorkspaceModelRepository {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description the console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger('repo[workspace]', {
    timestamp: true,
  });

  /**
   * @constructor
   * @param client {EntityManager} the client for database connection
   */
  constructor(
    @InjectEntityManager()
    private readonly client: EntityManager,
  ) {}

  /**
   * @method convert
   * @description Turn entity to data model
   * @param entity {Workspace} the entity to convert
   * @returns {Workspace}
   */
  convert(entity: Workspace) {
    this.logger.debug(`convert(): Enter`);
    this.logger.debug(`convert(): $entity = ${JSON.stringify(entity)}`);
    return Object.assign(new WorkspaceModel(), entity);
  }

  /**
   * @async
   * @method create
   * @description Create a new workspace
   * @param entity {Workspace} the workspace to create
   * @returns {Promise<WorkspaceModel>}
   */
  async create(entity: Workspace) {
    this.logger.debug(`create(): Enter`);
    this.logger.debug(`create(): $entity = ${JSON.stringify(entity)}`);
    const result = await this.client.transaction(async (m) => {
      const account = await this.client.findOne(AccountModel, {
        where: { id: entity.account.id },
      });
      this.logger.debug(`create(): $account = ${JSON.stringify(account)}`);
      const user = await this.client.findOne(UserModel, {
        where: { id: entity.admin.id },
      });
      this.logger.debug(`create(): $user = ${JSON.stringify(user)}`);
      if (!account || !user) throw new PreconditionFailedException();
      const workspace = await m.save(
        Object.assign(this.convert(entity), { account: account }),
      );
      this.logger.debug(`create(): $workspace = ${JSON.stringify(workspace)}`);
      const roles = await m.find(SystemTeamModel);
      this.logger.debug(`create(): $roles = ${JSON.stringify(roles)}`);
      const teams = roles.map((r) => {
        const team = Object.assign(new TeamModel(), r, { owner: workspace });
        if (r.autoAssign)
          team.members.push(
            Object.assign(new MemberModel(), { team: team, user: user }),
          );
        return team;
      });
      this.logger.debug(`create(): $teams = ${JSON.stringify(teams)}`);
      await m.save(teams);
      return workspace;
    });
    return result;
  }

  /**
   * @method get
   * @description Loading an entry of workspace
   * @param id {string} the ID of the workspace
   * @returns {Promise<WorkspaceModel>}
   */
  get(id: string) {
    this.logger.debug(`get(): Enter`);
    this.logger.debug(`get(): $id = ${id}`);
    return this.client.findOne(WorkspaceModel, { where: { id: id } });
  }

  /**
   * @async
   * @method remove
   * @description Removing an existing workspace
   * @param entity {Workspace} the workspace to remove
   * @returns {Promise<Workspace>}
   */
  async remove(entity: Workspace) {
    this.logger.debug(`remove(): Enter`);
    this.logger.debug(`remove(): $entity = ${JSON.stringify(entity)}`);
    const model = await this.get(entity.id);
    if (!model) throw new NotFoundException();
    return this.client.remove(model);
  }

  /**
   * @async
   * @method search
   * @description Listing workspaces that fulfill the filter
   * @param filter {FindManyOptions<WorkspaceModel>}
   * @returns {Promise<WorkspaceModel[]>}
   */
  async search(filter: FindManyOptions<WorkspaceModel>) {
    this.logger.debug(`search(): Enter`);
    this.logger.debug(`search(): $filter = ${JSON.stringify(filter)}`);
    return this.client.find(WorkspaceModel, filter);
  }

  /**
   * @async
   * @method update
   * @description Updating an existing workspace
   * @param entity {Workspace} the workspace to update
   * @returns {Promise<WorkspaceModel>}
   */
  async update(entity: Workspace) {
    this.logger.debug(`update(): Enter`);
    this.logger.debug(`update(): $entity = ${JSON.stringify(entity)}`);
    const model = await this.get(entity.id);
    if (!model) throw new NotFoundException();
    const mutation = Object.assign(model, entity);
    return this.client.save(mutation);
  }
}
