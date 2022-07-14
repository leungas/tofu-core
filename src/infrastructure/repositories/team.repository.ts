import {
  Injectable,
  Logger,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Member } from 'src/domain/entities/member.entity';
import { Team } from 'src/domain/entities/team.entity';
import { User } from 'src/domain/entities/user.entity';
import { Workspace } from 'src/domain/entities/workspace.entity';
import { EntityManager, FindManyOptions } from 'typeorm';
import { MemberModel } from '../models/member.model';
import { TeamModel } from '../models/team.model';
import { UserModel } from '../models/user.model';
import { WorkspaceModel } from '../models/workspace.model';

/**
 * @class
 * @name TeamModelRepository
 * @description The data access logic for team related model
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class TeamModelRepository {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description The console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger(`repo[team]`, {
    timestamp: true,
  });

  /**
   * @cosntructor
   * @param client {EntityManager} the database connection
   */
  constructor(
    @InjectEntityManager()
    private readonly client: EntityManager,
  ) {}

  /**
   * @method convert
   * @description convert entity to data model
   * @param entity {Team} the entity to convert
   * @returns {Promise<TeamModel>}
   */
  convert(entity: Team) {
    this.logger.debug(`convert(): Enter`);
    this.logger.debug(`convert(): $entity = ${JSON.stringify(entity)}`);
    return Object.assign(new TeamModel(), entity);
  }

  /**
   * @async
   * @method assign
   * @description Assignng the members into a team
   * @param entity {Team} the team to assign to
   * @param members {Member[]} the mebers to assign to at the end
   * @returns {Promise<Team>}
   */
  async assign(entity: Team, members: User[]) {
    this.logger.debug(`assign(): Enter`);
    this.logger.debug(`assign(): $entity = ${JSON.stringify(entity)}`);
    this.logger.debug(`assign(): $members = ${JSON.stringify(members)}`);
    const team = await this.get(entity.id);
    if (!team) throw new PreconditionFailedException();
    const result = await this.client.transaction(async (m) => {
      const adds = members.filter(
        (m) => team.members.filter((mm) => mm.user.id === m.id).length === 0,
      );
      const takes = team.members.filter(
        (mm) => members.filter((m) => m.id === mm.user.id).length === 0,
      );
      const people = team.members
        .filter((m) => takes.filter((t) => t.id === m.id).length === 0)
        .push(
          ...adds.map((a) =>
            Object.assign(new MemberModel(), { team: team, user: a }),
          ),
        );
      const mutation = Object.assign(team, { members: people });
      return m.save(mutation);
    });
    return result;
  }

  /**
   * @async
   * @method create
   * @description Creating a new team
   * @param entity {Team} the team to create
   * @param owner {Workspace} the workspace that the team belongs to
   * @param members {Members[]} the team member to assign by default
   * @returns {Promise<Team>}
   */
  async create(entity: Team, owner: Workspace, members: Member[] = []) {
    this.logger.debug(`create(): Enter`);
    this.logger.debug(`create(): $entity = ${JSON.stringify(entity)}`);
    this.logger.debug(`create(): $owner = ${JSON.stringify(owner)}`);
    this.logger.debug(`create(): $members = ${JSON.stringify(members)}`);
    const result = this.client.transaction(async (m) => {
      const workspace = await m.findOne(WorkspaceModel, {
        where: { id: owner.id },
      });
      this.logger.debug(`create(): $workspace = ${JSON.stringify(workspace)}`);
      const model = await m.save(
        Object.assign(this.convert(entity), { owner: workspace }),
      );
      this.logger.debug(`create(): $model = ${JSON.stringify(model)}`);
      if (members.length > 0) {
        const subitems = await Promise.all(
          members.map(async (member) => {
            const u = await m.findOne(UserModel, {
              where: { id: member.user.id },
            });
            this.logger.debug(`create(): $u = ${JSON.stringify(u)}`);
            if (!u) throw new PreconditionFailedException();
            return Object.assign(new MemberModel(), { team: model, user: u });
          }),
        );
        this.logger.debug(`create(): $subitems = ${JSON.stringify(subitems)}`);
        await m.save(subitems);
      }
      return model;
    });
    this.logger.debug(`create(): $result = ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * @method get
   * @descrption Getting a specific team
   * @param id {string} the Id of the team
   * @returns {Promise<Team>}
   */
  get(id: string) {
    this.logger.debug(`get(): Enter`);
    this.logger.debug(`get(): $id = ${id}`);
    return this.client.findOne(TeamModel, { where: { id: id } });
  }

  /**
   * @async
   * @method remove
   * @description Remove the team from workspace
   * @param entity {Team} the team to remove
   * @returns {Promise<void>}
   */
  async remove(entity: Team) {
    this.logger.debug(`remove(): Enter`);
    this.logger.debug(`remove(): $entity = ${JSON.stringify(entity)}`);
    const model = await this.get(entity.id);
    if (!model) throw new NotFoundException();
    return this.client.remove(model);
  }

  /**
   * @method search
   * @description Listing teams that matching the filter
   * @param filter {FindManyOption<TeamModel>}
   * @returns {Promise<TeamModel[]>}
   */
  search(filter: FindManyOptions<TeamModel>) {
    this.logger.debug(`search(): Enter`);
    this.logger.debug(`search(): $filter = ${JSON.stringify(filter)}`);
    return this.client.find(TeamModel, filter);
  }

  /**
   * @async
   * @method update
   * @description Updating the existing team
   * @param entity {Team} the team to update
   * @returns {Promise<Team>}
   */
  async update(entity: Team) {
    this.logger.debug(`update(): Enter`);
    this.logger.debug(`update(): $entity = ${JSON.stringify(entity)}`);
    const model = await this.get(entity.id);
    this.logger.debug(`update(): $model = ${JSON.stringify(model)}`);
    if (!model) throw new NotFoundException();
    const mutation = Object.assign(model, entity);
    this.logger.debug(`update(): $mutation = ${JSON.stringify(mutation)}`);
    return this.client.save(mutation);
  }
}
