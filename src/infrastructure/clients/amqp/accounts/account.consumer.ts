import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Capability } from 'src/domain/entities/capability.entity';
import configuration from 'src/infrastructure/config/configuration';

/**
 * @class
 * @name AccountServiceConsumer
 * @description The consumer for for account service related topics
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class AccountServiceConsumer {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description The console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger('consumer[accounts]', {
    timestamp: true,
  });

  /**
   * @constructor
   * @param emitter {EventEmitter2} the event emitter for service
   */
  constructor(private readonly emitter: EventEmitter2) {
  }

  /**
   * @async
   * @method register
   * @description application registering capability
   * @param message {any} the message recieved
   * @returns {Promise<void>}
   */
  @RabbitSubscribe({
    exchange: configuration().exchange.exchanges.accounts.name,
    routingKey: 'core.accounts.account.registered',
    queue: 'workspaces.account.registered',
  })
  async accountRegistered(message: any[]) {
    this.logger.debug('accountRegistered(): Enter');
    this.logger.debug(`accountRegistered(): $message = ${JSON.stringify(message)}`);
    // const items = message.map((i) => Object.assign(new Capability(), i));
    // const event = new CapabilityRegisteredEvent(items);
    // await this.emitter.emitAsync('capability.registered', event);
  }
}
