import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Team } from 'src/domain/entities/team.entity';

/**
 * @class
 * @name AccessServiceProvider
 * @description the provider to AMQP for access service
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class AccessServiceProvider {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description The console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger(`producer[access]`, {
    timestamp: true,
  });

  /**
   * @constructor
   * @param config {ConfigSerivce} the service for accessing config log
   * @param client {AmqpConnection} the connection to RabbitMQ
   */
  constructor(
    private readonly config: ConfigService,
    private readonly client: AmqpConnection,
  ) {}

  /**
   * @async
   * @method teamCreated
   * @description Sending message for team creation to accesss
   * @param entity {Team} the team that gets created
   * @returns {Promise<void>}
   */
  async teamCreated(entity: Team) {
    this.logger.debug(`teamCreated(): Enter`);
    this.logger.debug(`teamCreated(): $entity = ${JSON.stringify(entity)}`);
  }

  /**
   * @async
   * @method teamReassigned
   * @param entity {Team} the team data after reassignment
   * @returns {Promise<void>}
   */
  async teamReassigned(entity: Team) {
    this.logger.debug(`teamReassigned(): Enter`);
    this.logger.debug(`teamReassigned(): $entity = ${JSON.stringify(entity)}`);
  }

  /**
   * @async
   * @method teamRemoved
   * @description Sending message for team removed to accesss
   * @param entity {Team} the team that gets created
   * @returns {Promise<void>}
   */
  async teamRemoved(entity: Team) {
    this.logger.debug(`teamRemoved(): Enter`);
    this.logger.debug(`teamRemoved(): $entity = ${JSON.stringify(entity)}`);
  }
}
