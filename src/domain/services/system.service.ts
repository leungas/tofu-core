import { Injectable } from '@nestjs/common';

/**
 * @class
 * @name SystemService
 * @description The service for system functions
 * @author Mark Leung <leungas@gmail.com>
 */
@Injectable()
export class SystemService {
  /**
   * @method heartbeat
   * @description The heart beat signal for the app
   * @returns {string}
   */
  heartbeat(): string {
    return 'TOFU Workspace Core is up';
  }
}
