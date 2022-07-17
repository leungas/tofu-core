import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { WorkspaceCreateObject } from '../../app/dto/workspace.create.dto';
import { AccountModelRepository } from '../../infrastructure/repositories/account.repository';
import { WorkspaceModelRepository } from '../../infrastructure/repositories/workspace.repository';
import { FindManyOptions } from 'typeorm';
import { Account } from '../entities/account.entity';
import { User } from '../entities/user.entity';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceModel } from '../../infrastructure/models/workspace.model';
import { Team } from '../entities/team.entity';
import { WorkspaceUpdateObject } from '../../app/dto/workspace.update.dto';

@Injectable()
export class WorkspaceService {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description The this.logger logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger('service[workspace]', {
    timestamp: true,
  });

  /**
   * @constructor
   * @param workspaces {WorkspaceModelRepository} data access logic
   */
  constructor(
    private readonly accounts: AccountModelRepository,
    private readonly workspaces: WorkspaceModelRepository,
  ) {}

  /**
   * @private
   * @method convert
   * @description convert incoming instance to Workspace
   * @param source {any} the source object
   * @returns {Workspace}
   */
  private convert(source: any) {
    this.logger.debug('convert(): Enter');
    this.logger.debug(`convert(): $source = ${JSON.stringify(source)}`);
    const result = Object.assign(new Workspace(), source);
    if (Reflect.get(source, 'admin'))
      result.admin = Object.assign(new User(), Reflect.get(source, 'admin'));
    if (Reflect.get(source, 'account'))
      result.account = Object.assign(
        new Account(),
        Reflect.get(source, 'account'),
      );
    if (Reflect.get(source, 'teams'))
      result.teams = (Reflect.get(source, 'teams') as any[]).map((t) => {
        const team = Object.assign(new Team(), t);
        if (Reflect.get(t, 'members')) {
          const members = Reflect.get(t, 'members') as any[];
          this.logger.debug(`convert(): $members = ${JSON.stringify(members)}`);
        }
        return team;
      });
    this.logger.debug(`convert(): $result = ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * @async
   * @method create
   * @description creating a new instance of workspace
   * @param request {WorkspaceCreateObject} the request for creation
   * @returns {Promise<Workspace>}
   */
  async create(account: string, request: WorkspaceCreateObject) {
    this.logger.debug('create(): Enter');
    this.logger.debug(`create(): $account = ${JSON.stringify(account)}`);
    this.logger.debug(`create(): $request = ${JSON.stringify(request)}`);
    const entity = this.convert(
      Object.assign(request, { account: { id: account } }),
    );
    this.logger.debug(`create(): $entity = ${JSON.stringify(entity)}`);
    const base = await this.accounts.get(entity.account.id);
    this.logger.debug(`create(): $base = ${JSON.stringify(base)}`);
    if (!base) throw new PreconditionFailedException();
    const query: FindManyOptions<WorkspaceModel> = {
      relations: ['account'],
      where: {
        account: { id: account },
        name: request.name,
      },
    };
    this.logger.debug(`create(): $query = ${JSON.stringify(query)}`);
    const exists = await this.workspaces.search(query);
    this.logger.debug(`create(): $exists = ${JSON.stringify(exists)}`);
    if (exists.length > 0) throw new ConflictException();
    return this.workspaces.create(Object.assign(entity, { account: base }));
  }

  /**
   * @asypc
   * @method get
   * @description Getting an existing workspace
   * @param account {string} the account ID to use
   * @param workspace {string} the workspace ID to fetch
   * @returns {Promise<Workspace>}
   */
  async get(account: string, workspace: string) {
    this.logger.debug(`get(): Enter`);
    this.logger.debug(`get(): $account = ${account}`);
    this.logger.debug(`get(): $workspace = ${workspace}`);
    const result = await this.workspaces.search({
      relations: ['account'],
      where: {
        account: { id: account },
        id: workspace,
      },
    });
    this.logger.debug(`get(): $result = ${JSON.stringify(result)}`);
    if (result.length > 0) return this.convert(result[0]);
    else throw new NotFoundException();
  }

  /**
   * @async
   * @method remove
   * @description Remving an existing workspace
   * @param account {string} the account ID
   * @param workspace {string} the workspace ID
   * @returns {Promise<void>}
   */
  async remove(account: string, workspace: string) {
    this.logger.debug(`remove(): Enter`);
    this.logger.debug(`remove(): $account = ${account}`);
    this.logger.debug(`remove(): $workspace = ${workspace}`);
    const entity = await this.get(account,workspace);
    if (!entity) throw new NotFoundException();
    await this.workspaces.remove(entity);
  }

  /**
   * @async
   * @method update
   * @description Updating an existing workspace data
   * @param account {string} the account ID to use
   * @param workspace {string} the workspace ID to update
   * @param request {WorkspaceUpdateObject} the object data to mutate
   * @returns {Promise<Workspace>}
   */
  async update(
    account: string,
    workspace: string,
    request: WorkspaceUpdateObject,
  ) {
    this.logger.debug(`update(): Enter`);
    this.logger.debug(`update(): $account = ${account}`);
    this.logger.debug(`update(): $workspace = ${workspace}`);
    this.logger.debug(`update(): $request = ${JSON.stringify(request)}`);
    const filter: FindManyOptions<WorkspaceModel> = {
      relations: ['account'],
      where: {
        account: { id: account },
        id: workspace,
      },
    };
    this.logger.debug(`update(): $request = ${JSON.stringify(filter)}`);
    const entity = await this.workspaces.search(filter);
    this.logger.debug(`update(): $entity = ${JSON.stringify(entity)}`);
    if (entity.length === 0) throw new NotFoundException();
    const mutation = Object.assign(entity[0], request);
    this.logger.debug(`update(): $mutation = ${JSON.stringify(mutation)}`);
    const result = await this.workspaces.update(mutation);
    this.logger.debug(`update(): $result = ${JSON.stringify(result)}`);
    return this.convert(result);
  }
}
