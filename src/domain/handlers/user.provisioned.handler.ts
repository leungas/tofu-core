import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserServiceProvider } from '../../infrastructure/clients/amqp/users/user.producer';
import { UserProvisionedEvent } from '../events/user.provision.event';

/**
 * @class
 * @name UserProvisionedListener
 * @description The listener for handling the provisioned event
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class UserProvisionedListener {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description The console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger(`listener[user.provision]`, {
    timestamp: true,
  });

  /**
   * @constructor
   * @param producer {UserServiceProvider} the producer to access to user service
   */
  constructor(private readonly producer: UserServiceProvider) {}

  /**
   * @async
   * @method handle
   * @description the main handler for the event
   * @param event {UserProvisionedEvent} the event received
   * @returns {Promise<void>}
   */
  @OnEvent('workspaces.user.provisioned')
  async handle(event: UserProvisionedEvent) {
    this.logger.debug(`handle(): Enter`);
    this.logger.debug(`handle(): $event = ${JSON.stringify(event)}`);
    if (event.user.firstName !== undefined || event.user.lastName !== undefined)
      this.producer.userProvisioned(event.user);
  }
}
