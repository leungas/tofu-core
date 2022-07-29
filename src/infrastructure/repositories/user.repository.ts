import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { EntityManager } from 'typeorm';
import { UserModel } from '../models/user.model';

/**
 * @class
 * @name UserModelRepository
 * @description The user model data access logic
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class UserModelRepository {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description the console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger('repo[user]', {
    timestamp: true,
  });

  /**
   * @constructor
   * @param client {EntityManager} the database client
   */
  constructor(
    @InjectEntityManager()
    private readonly client: EntityManager,
  ) {}

  /**
   * @async
   * @method convert
   * @description convert to data model
   * @param source {any} the source data structure
   * @returns {UserModel}
   */
  private convert(source: any) {
    this.logger.debug('convert(): Enter');
    this.logger.debug(`convert(): $source = ${JSON.stringify(source)}`);
    const model = Object.assign(new User(), source);
    this.logger.debug(`convert(): $model = ${JSON.stringify(model)}`);
    return model;
  }

  /**
   * @async
   * @method create
   * @description create a new user instance
   * @param entity {User} the user to create
   * @returns {Promise<User>}
   */
  async create(entity: User) {
    this.logger.debug('create(): Enter');
    this.logger.debug(`create(): $entity = ${JSON.stringify(entity)}`);
    const mutation = this.convert(entity);
    this.logger.debug(`create(): $mutation = ${JSON.stringify(mutation)}`);
    const result = await this.client.save(mutation);
    this.logger.debug(`create(): $result = ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * @async
   * @method get
   * @description get a single instance of the user
   * @param id {string} the ID of the user
   * @returns {Promise<User>}
   */
  async get(id: string) {
    this.logger.debug('get(): Enter');
    this.logger.debug(`get(): $id = ${id}`);
    return this.client.findOne(UserModel, { where: { id: id } });
  }

  /**
   * @async
   * @method remove
   * @description Removing an existing item
   * @param id {string} the target ID to remove
   * @returns {Promise<void>}
   */
  async remove(id: string) {
    this.logger.debug('remove(): Enter');
    this.logger.debug(`remove(): $id = ${id}`);
    const model = await this.get(id);
    if (!model) throw new NotFoundException();
    return this.client.remove(model);
  }

  /**
   * @async
   * @method search
   * @param filter
   * @returns
   */
  async search(filter: any) {
    this.logger.debug('search(): Enter');
    this.logger.debug(`search(): $filter = ${JSON.stringify(filter)}`);
    return this.client.find(UserModel, filter);
  }

  /**
   * @property
   * @name update
   * @param entity {User} the entity submitted for update
   * @returns {Promise<User>}
   */
  async update(entity: User) {
    this.logger.debug(`update(): Enter`);
    this.logger.debug(`update(): $entity = ${JSON.stringify(entity)}`);
    const model = this.convert(entity);
    this.logger.debug(`update(): $model = ${JSON.stringify(model)}`);
    const before = await this.get(model.id);
    this.logger.debug(`update(): $before = ${JSON.stringify(before)}`);
    if (!before) throw new NotFoundException();
    const after = Object.assign(before, model);
    const result = await this.client.save(after);
    this.logger.debug(`update(): $result = ${JSON.stringify(result)}`);
    return result;
  }
}
