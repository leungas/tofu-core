import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/domain/entities/user.entity';

/**
 * @class
 * @name UserServiceProvider
 * @description the provider for sending to users service
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class UserServiceProvider {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description the console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger('producer[user]', {
    timestamp: true,
  });

  /**
   * @constructor
   * @param config {ConfigService} the access to configuration data
   * @param client {AmqpConnection} the connection to AMQP
   */
  constructor(
    private readonly config: ConfigService,
    private readonly client: AmqpConnection,
  ) {}

  /**
   * @method userProvisioned
   * @description publishing the user being provisioned just now
   * @param user {User} the user being provisioned
   * @returns {Promise<void>}
   */
  async userProvisioned(user: User) {
    this.logger.debug('userProvisioned(): Enter');
    this.logger.debug(`userProvisioned(): $user = ${JSON.stringify(user)}`);
    const exchange = this.config.get('exchange.exchanges.users.name');
    this.logger.debug(
      `userProvisioned(): $exchange = ${JSON.stringify(exchange)}`,
    );
    const routing = this.config.get(
      'exchange.exchanges.users.user.provisioned',
    );
    this.logger.debug(
      `userProvisioned(): $routing = ${JSON.stringify(routing)}`,
    );
    await this.client.publish(exchange, routing, user);
  }
}
