import { Injectable, Logger } from '@nestjs/common';
import { WorkspaceCreateObject } from 'src/app/dto/workspace.create.dto';
import { AccountModelRepository } from 'src/infrastructure/repositories/account.repository';
import { WorkspaceModelRepository } from 'src/infrastructure/repositories/workspace.repository';
import { User } from '../entities/user.entity';
import { Workspace } from '../entities/workspace.entity';

@Injectable()
export class WorkspaceService {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description The console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger('service[workspace]', {
    timestamp: true,
  });

  /**
   * @constructor
   * @param workspaces {WorkspaceModelRepository} data access logic
   */
  constructor(
    private readonly accounts: AccountModelRepository,
    private readonly workspaces: WorkspaceModelRepository,
  ) {}

  /**
   * @private
   * @method convert
   * @description convert incoming instance to Workspace
   * @param source {any} the source object
   * @returns {Workspace}
   */
  private async convert(source: any) {
    this.logger.debug('convert(): Enter');
    this.logger.debug(`convert(): $source = ${JSON.stringify(source)}`);
    const result = Object.assign(new Workspace(), source);
    if (Reflect.get(source, 'admin'))
      result.admin = Object.assign(new User(), Reflect.get(source, 'admin'));
    this.logger.debug(`convert(): $result = ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * @async
   * @method create
   * @description creating a new instance of workspace
   * @param request {WorkspaceCreateObject} the request for creation
   * @returns {Promise<Workspace>}
   */
  async create(account: string, request: WorkspaceCreateObject) {
    this.logger.debug('create(): Enter');
    this.logger.debug(`create(): $account = ${JSON.stringify(account)}`);
    this.logger.debug(`create(): $request = ${JSON.stringify(request)}`);
  }
}
