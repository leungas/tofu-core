import {
  Injectable,
  Logger,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InvitationConsumeObject } from 'src/app/dto/invitation.consume.dto';
import { InvitationCreateObject } from 'src/app/dto/invitation.create.dto';
import { InvitiationModel } from 'src/infrastructure/models/invitation.model';
import { InvitationModelRepository } from 'src/infrastructure/repositories/invitation.repository';
import { FindManyOptions, IsNull, Not } from 'typeorm';
import { Invitation } from '../entities/invitation.entity';
import { UserProvisionedEvent } from '../events/user.provision.event';

/**
 * @class
 * @name InvitationService
 * @description the service logic for invitation management
 * @author Mark Leung <lunegas@gmail.com>
 */
@Injectable()
export class InvitationService {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description The logger to consume
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger('service[invitation]', {
    timestamp: true,
  });

  /**
   * @constructor
   * @param repository {InvitationModelRepository} the data access logic for invitation
   */
  constructor(
    private readonly repository: InvitationModelRepository,
    private readonly emitter: EventEmitter2,
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
    const result: Invitation = Object.assign(new Invitation(), source);
    this.logger.debug(`convert(): $result = ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * @async
   * @method consume
   * @description Trigger consuming an invitation
   * @param id {string} the ID of the invitation
   * @param request {InvitationConsumeObject} the request to use for consumption
   * @returns {Promise<Invitiation>}
   */
  async consume(id: string, request: InvitationConsumeObject) {
    this.logger.debug(`consume(): Enter`);
    this.logger.debug(`consume(): $id = ${id}`);
    this.logger.debug(`consume(): $request = ${JSON.stringify(request)}`);
    const invitation = await this.repository.get(id);
    if (invitation.activationCode !== request.activationCode)
      throw new PreconditionFailedException();
    const user = Object.assign(invitation.linkedUser, request);
    const result = await this.repository.consume(invitation, user);
    await this.emitter.emitAsync(
      'user.provisioned',
      new UserProvisionedEvent(user),
    );
    return result;
  }

  /**
   * @async
   * @method create
   * @description Generating a new invitation
   * @param request {InvitationCreateObject} the invitation to create
   * @returns {Promise<Invitation>}
   */
  async create(request: InvitationCreateObject) {
    this.logger.debug(`create(): Enter`);
    this.logger.debug(`create(): $request = ${JSON.stringify(request)}`);
    const entity = this.convert(request);
    this.logger.debug(`create(): $entity = ${JSON.stringify(entity)}`);
    return this.convert(await this.repository.create(entity));
  }

  /**
   * @async
   * @method list
   * @description The listing of unconsumed invitation
   * @returns {Promise<Invitation[]>}
   */
  async list() {
    this.logger.debug(`create(): Enter`);
    const filter: FindManyOptions<InvitiationModel> = {
      where: {
        consumedOn: Not(IsNull()),
      },
    };
    const result = await this.repository.search(filter);
    return result.map((i) => this.convert(i));
  }

  /**
   * @async
   * @method remove
   * @description The removal of an invitatiion
   * @param id {string} the ID of the invitation to disable
   * @returns {void}
   */
  async remove(id: string) {
    this.logger.debug(`remove(): Enter`);
    this.logger.debug(`remove(): $id = ${id}`);
    const invite = await this.repository.get(id);
    if (!invite) throw new NotFoundException();
    await this.repository.remove(this.convert(invite));
  }
}
