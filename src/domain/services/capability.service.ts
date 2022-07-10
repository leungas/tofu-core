import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountServiceProducer } from 'src/infrastructure/clients/amqp/accounts/account.producer';
import { Capability } from '../entities/capability.entity';

/**
 * @class
 * @name CapabilityService
 * @description The capability logic management
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class CapabilityService {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description the console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger('service[cap]', {
    timestamp: true,
  });

  /**
   * @constructor
   * @param config {ConfigService} the configuraton setup
   */
  constructor(
    private readonly config: ConfigService,
    private readonly client: AccountServiceProducer,
  ) {}

  /**
   * @private
   * @method load
   * @description loading up the capabilities of app
   * @returns {Capability[]}
   */
  private load(): Capability[] {
    this.logger.debug('load(): Enter');
    const caps = this.config.get('app.capability');
    this.logger.debug(`load(): $cap = ${JSON.stringify(caps)}`);
    if (caps && Array.isArray(caps))
      return caps.map((a) => Object.assign(new Capability(), a));
    else return [];
  }

  /**
   * @async
   * @method sync
   * @description register the data for registration
   * @returns {Promise<void>}
   */
  async sync() {
    this.logger.debug('sync(): Enter');
    const items = this.load();
    const payload = items.map((i) => ({
      application: this.config.get('app.name'),
      code: i.name,
      description: i.description,
      defaultValue: i.value,
      isProvisionOnDefault: i.system,
    }));
    if (payload.length > 0) await this.client.registerCapabilities(payload);
  }
}
