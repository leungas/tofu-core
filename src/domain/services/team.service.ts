import {
  Injectable,
  Logger,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { TeamCreateObject } from '../../app/dto/team.create.dto';
import { TeamModel } from '../../infrastructure/models/team.model';
import { TeamModelRepository } from '../../infrastructure/repositories/team.repository';
import { UserModelRepository } from '../../infrastructure/repositories/user.repository';
import { WorkspaceModelRepository } from '../../infrastructure/repositories/workspace.repository';
import { FindManyOptions } from 'typeorm';
import { Member } from '../entities/member.entity';
import { Team } from '../entities/team.entity';
import { User } from '../entities/user.entity';
import { TeamUpdateObject } from 'src/app/dto/team.update.dto';

/**
 * @class
 * @name TeamService
 * @description the business logic layer for team related matters
 */
@Injectable()
export class TeamService {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description The console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger(`service[team]`, {
    timestamp: true,
  });

  /**
   * @constructor
   * @param teams {TeamModelRepository} the team data access
   * @param users {UserModelRepository} the user data access
   * @param workspaces {WorkspaceModelRepository} the workspace data access
   */
  constructor(
    private readonly teams: TeamModelRepository,
    private readonly users: UserModelRepository,
    private readonly workspaces: WorkspaceModelRepository,
  ) {}

  /**
   * @method convert
   * @description converting object into localise entity
   * @param source {any} the incoming source object
   * @returns {Team}
   */
  convert(source: any) {
    this.logger.debug(`convert(): Enter`);
    this.logger.debug(`convert(): $source = ${JSON.stringify(source)}`);
    const result: Team = Object.assign(new Team(), source);
    this.logger.debug(`convert(): $result = ${JSON.stringify(result)}`);
    const members = Reflect.get(source, 'members') as any[];
    this.logger.debug(`convert(): $members = ${JSON.stringify(members)}`);
    if (members) {
      result.members = members.map((i) => {
        const data = Reflect.get(i, 'user');
        const param = typeof data === 'string' ? { id: data } : data;
        return Object.assign(new User(), param);
      });
    }
    this.logger.debug(`convert(): $result (final) = ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * @async
   * @method create
   * @description creating a new team structure
   * @param account {string} the account the workspace binds to
   * @param workspace {string} the workspace we want to bind team
   * @param request {TeamCreateObject} the object structure for create team
   * @returns {Promise<Team>}
   */
  async create(account: string, workspace: string, request: TeamCreateObject) {
    this.logger.debug(`create(): Enter`);
    this.logger.debug(`create(): $account = ${account}`);
    this.logger.debug(`create(): $workspace = ${workspace}`);
    this.logger.debug(`create(): $request = ${JSON.stringify(request)}`);
    const parent = await this.workspaces.search({
      relations: ['account'],
      where: {
        account: { id: account },
        id: workspace,
      },
    });
    this.logger.debug(`create(): $parent = ${JSON.stringify(parent)}`);
    if (parent.length === 0) throw new PreconditionFailedException();
    if (request.members.length > 0) {
      const members = await Promise.all(
        request.members.map(async (m) => {
          const result = await this.users.get(m.user);
          if (!result) throw new PreconditionFailedException();
          return Object.assign(new Member(), { user: result });
        }),
      );
      request = Object.assign(request, { members: members });
    }
    const entity = this.convert(request);
    this.logger.debug(`create(): $parent = ${JSON.stringify(parent)}`);
    const result = await this.teams.create(entity, parent[0], entity.members);
    this.logger.debug(`create(): $parent = ${JSON.stringify(parent)}`);
    return this.convert(result);
  }

  /**
   * @async
   * @method get
   * @description Getting data for a specific team
   * @param account {string} the account for the workspace
   * @param workspace {string} the workspace id for the team owner
   * @param team {string} the id for the team
   * @returns {Promise<Team>}
   */
  async get(account: string, workspace: string, team: string) {
    this.logger.debug(`get(): Enter`);
    this.logger.debug(`get(): $account = ${account}`);
    this.logger.debug(`get(): $workspace = ${workspace}`);
    this.logger.debug(`get(): $team = ${team}`);
    const filter: FindManyOptions<TeamModel> = {
      relations: ['owner'],
      where: {
        owner: { id: workspace },
        id: team,
      },
    };
    const result = await this.teams.search(filter);
    if (result.length === 0) throw new NotFoundException();
    return this.convert(result[0]);
  }

  /**
   * @async
   * @method remove
   * @description Removing an existing team
   * @param account {string} the ID fo the account for the workspace
   * @param workspace {string} the ID for the workspace for the bind
   * @param team {string} the ID of the team
   * @returns {Promise<void>}
   */
  async remove(account: string, workspace: string, team: string) {
    this.logger.debug(`remove(): Enter`);
    this.logger.debug(`remove(): $account = ${account}`);
    this.logger.debug(`remove(): $workspace = ${workspace}`);
    this.logger.debug(`remove(): $team = ${team}`);
    const entity = await this.get(account, workspace, team);
    if (!entity) throw new NotFoundException();
    return this.teams.remove(entity);
  }

  /**
   * @async
   * @method search
   * @description Searching for team data on a workspace
   * @param account {string} the account the workspace belongs to
   * @param workspace {string} the workspace ID to use to search
   * @returns {Promise<Team[]>}
   */
  async search(account: string, workspace: string) {
    this.logger.debug(`search(): Enter`);
    this.logger.debug(`search(): $account = ${account}`);
    this.logger.debug(`search(): $workspace = ${workspace}`);
    const filter: FindManyOptions<TeamModel> = {
      relations: ['owner'],
      where: {
        owner: { id: workspace },
      },
    };
    const results = await this.teams.search(filter);
    console.log(`search(): $results = ${JSON.stringify(results)}`);
    return results.map((i) => this.convert(i));
  }

  /**
   * @async
   * @method update
   * @description updating an existing team details
   * @param account {string} the ID of the account
   * @param workspace {string} the ID of the workspace
   * @param team {string} the ID of the team
   * @param request {TeamUpdateObject} the request for updating
   * @returns {Promise<Team>}
   */
  async update(
    account: string,
    workspace: string,
    team: string,
    request: TeamUpdateObject,
  ) {
    this.logger.debug(`update(): Enter`);
    this.logger.debug(`update(): $account = ${account}`);
    this.logger.debug(`update(): $workspace = ${workspace}`);
    this.logger.debug(`update(): $team = ${team}`);
    this.logger.debug(`update(): $request = ${JSON.stringify(request)}`);
    const parent = await this.workspaces.get(workspace);
    this.logger.debug(`update(): $parent = ${JSON.stringify(parent)}`);
    if (!parent || (parent && parent.account.id !== account))
      throw new PreconditionFailedException();
    const model = parent.teams.find((t) => t.id === team);
    this.logger.debug(`update(): $model = ${JSON.stringify(model)}`);
    if (!model) throw new NotFoundException();
    const mutation = Object.assign(model, request);
    this.logger.debug(`update(): $mutation = ${JSON.stringify(mutation)}`);
    const result = await this.teams.update(mutation);
    this.logger.debug(`update(): $result = ${JSON.stringify(result)}`);
    return this.convert(result);
  }
}
