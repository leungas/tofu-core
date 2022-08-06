import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { handlers } from './handlers';
import { services } from './services';
import { CapabilityService } from './services/capability.service';

/**
 * @module DomainModule
 * @description the wiring of domain lauyer
 * @author Mark Leung <leungas@gmail.com>
 */
@Module({
  imports: [InfrastructureModule],
  providers: [...services, ...handlers],
  exports: [...services],
})
export class DomainModule implements OnApplicationBootstrap {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description the console logger for the module
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger('module[domain]', {
    timestamp: true,
  });

  /**
   * @constructor
   * @param capabilities {CapabilityService} the service for capabilities
   */
  constructor(private readonly capabilities: CapabilityService) {}

  /**
   * @async
   * @method onApplicationBootstrap
   * @description the pre module preparation trigger
   * @returns {Promise<void>}
   */
  async onApplicationBootstrap() {
    this.logger.debug('onApplicationBootstrap(): Enter');
    await this.capabilities.sync();
  }
}
