import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * @class
 * @name AccountServiceProvider
 * @description the provider for sending to account service
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class AccountServiceProducer {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description the console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger('producer[account]', {
    timestamp: true,
  });

  /**
   * @constructor
   * @param config
   * @param client
   */
  constructor(
    private readonly config: ConfigService,
    private readonly client: AmqpConnection,
  ) {}

  /**
   * @method registerCapabilities
   * @description publishing the available capabilities available in the app
   * @param items {any[]} the list of cap available
   * @returns {Promise<void>}
   */
  async registerCapabilities(items: any[]) {
    this.logger.debug('registerCapability(): Enter');
    this.logger.debug(
      `registerCapability(): $items = ${JSON.stringify(items)}`,
    );
    const exchange = this.config.get('exchange.exchanges.accounts.name');
    this.logger.debug(
      `registerCapability(): $exchange = ${JSON.stringify(exchange)}`,
    );
    const routing = this.config.get(
      'exchange.exchanges.accounts.capability.register',
    );
    this.logger.debug(
      `registerCapability(): $routing = ${JSON.stringify(routing)}`,
    );
    await this.client.publish(exchange, routing, items);
  }
}
