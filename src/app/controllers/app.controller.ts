import { Controller, Get } from '@nestjs/common';
import { SystemService } from '../../domain/services/system.service';

/**
 * @class
 * @name AppController
 * @description The controller for the main application
 * @author Mark Leung <leungas@gmail.com>
 */
@Controller()
export class AppController {
  constructor(private readonly system: SystemService) {}

  /**
   * @method healthcheck
   * @description the getting our health check done
   * @returns {string}
   */
  @Get()
  healthcheck(): string {
    return this.system.heartbeat();
  }
}
