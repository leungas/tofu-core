import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Invitation } from 'src/domain/entities/invitation.entity';
import { User } from 'src/domain/entities/user.entity';
import { EntityManager, FindManyOptions } from 'typeorm';
import { InvitiationModel } from '../models/invitation.model';
import { UserModel } from '../models/user.model';

/**
 * @class
 * @name InvitationModelRepository
 * @description The data access logic for invitation related model
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class InvitationModelRepository {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description The console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger(`repo[invitation]`, {
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
   * @async
   * @method consume
   * @description Consuming an invitation and activate the uer
   * @param entity {Invitation} the invitation to consume
   * @param user {User} the user sourced from the invitation
   * @returns {Promise<InvitiationModel>}
   */
  async consume(entity: Invitation, user: User) {
    this.logger.debug(`consume(): Enter`);
    this.logger.debug(`consume(): $entity = ${JSON.stringify(entity)}`);
    this.logger.debug(`consume(): $user = ${JSON.stringify(user)}`);
    const model = await this.get(entity.id);
    if (!model) throw new NotFoundException();
    return await this.client.transaction(async (m) => {
      await m.save(Object.assign(model.linkedUser, user));
      return m.save(Object.assign(model, { consumedOn: new Date() }));
    });
  }

  /**
   * @method convert
   * @description convert entity to data model
   * @param entity {Team} the entity to convert
   * @returns {Promise<InvitationModel>}
   */
  convert(entity: Invitation) {
    this.logger.debug(`convert(): Enter`);
    this.logger.debug(`convert(): $entity = ${JSON.stringify(entity)}`);
    return Object.assign(new InvitiationModel(), entity);
  }

  /**
   * @async
   * @method create
   * @description Creating a new team
   * @param entity {Team} the team to create
   * @param owner {Workspace} the workspace that the team belongs to
   * @param members {Members[]} the team member to assign by default
   * @returns {Promise<Invitation>}
   */
  async create(entity: Invitation) {
    this.logger.debug(`create(): Enter`);
    this.logger.debug(`create(): $entity = ${JSON.stringify(entity)}`);
    const result = this.client.transaction(async (m) => {
      const invitation = await m.save(this.convert(entity));
      const user = Object.assign(new UserModel(), {
        email: invitation.email,
        invitation: invitation,
      });
      await m.save(user);
      return invitation;
    });
    this.logger.debug(`create(): $result = ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * @method get
   * @descrption Getting a specific team
   * @param id {string} the Id of the team
   * @returns {Promise<Invitation>}
   */
  get(id: string) {
    this.logger.debug(`get(): Enter`);
    this.logger.debug(`get(): $id = ${id}`);
    return this.client.findOne(InvitiationModel, { where: { id: id } });
  }

  /**
   * @async
   * @method remove
   * @description Remove the team from workspace
   * @param entity {Team} the team to remove
   * @returns {Promise<void>}
   */
  async remove(entity: Invitation) {
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
   * @returns {Promise<InvitiationModel[]>}
   */
  async search(filter: FindManyOptions<InvitiationModel>) {
    this.logger.debug(`search(): Enter`);
    this.logger.debug(`search(): $filter = ${JSON.stringify(filter)}`);
    const result = await this.client.find(InvitiationModel, filter);
    this.logger.debug(`search(): $result = ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * @async
   * @method update
   * @description Updating the existing team
   * @param entity {Invitation} the team to update
   * @returns {Promise<Invitation>}
   */
  async update(entity: Invitation) {
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
