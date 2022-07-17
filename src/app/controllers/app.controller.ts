import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WorkspaceService } from '../../domain/services/workspace.service';
import { SystemService } from '../../domain/services/system.service';
import { WorkspaceCreateObject } from '../dto/workspace.create.dto';
import { v4 as uuid } from 'uuid';
import { WorkspaceUpdateObject } from '../dto/workspace.update.dto';

/**
 * @class
 * @name AppController
 * @description The controller for the main application
 * @author Mark Leung <leungas@gmail.com>
 */
@Controller()
export class AppController {
  /**
   * @private
   * @readonly
   * @property
   * @name logger
   * @description the console logger
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger('controller[app]', {
    timestamp: true,
  });

  /**
   * @constructor
   * @param system {SystemService} the system related endpoint
   * @param workspaces {WorkspaceSerivce} the workspace related services
   */
  constructor(
    private readonly system: SystemService,
    private readonly workspaces: WorkspaceService,
  ) {}

  /**
   * @method healthcheck
   * @description the getting our health check done
   * @returns {string}
   */
  @Get()
  healthcheck(): string {
    return this.system.heartbeat();
  }

  @Post('accounts/:account/workspaces')
  @HttpCode(HttpStatus.CREATED)
  @ApiTags('Workspaces')
  @ApiOperation({
    summary: 'Create new workspace',
    description: 'Create new workspace under an existing account',
  })
  @ApiBody({
    type: WorkspaceCreateObject,
  })
  @ApiParam({
    name: 'account',
    description: 'The account ID new workspace to bind with',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The request is successfully processed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not logged in when accessing service',
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'The connectivity is not available',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The workspace name/code is already occupied',
  })
  @ApiResponse({
    status: HttpStatus.GATEWAY_TIMEOUT,
    description: 'The request took longer than expected to complete.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Problem discovered in service, check logs for details',
  })
  create(
    @Param('account') account: string,
    @Body() request: WorkspaceCreateObject,
  ) {
    this.logger.debug(`create(): Enter`);
    this.logger.debug(`create(): $request = ${JSON.stringify(request)}`);
    return this.workspaces.create(account, request);
  }

  /**
   * @method getWorkspace
   * @description Get workspace data for an existing workspace
   * @param account {string} the Account ID
   * @param workspace {string} the Workspace ID
   * @returns {Promise<Workspace>}
   */
  @Get('accounts/:account/workspaces/:workspace')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Workspaces')
  @ApiOperation({
    summary: 'Load a workspace',
    description: 'Getting data for a specific existing workspace',
  })
  @ApiParam({
    name: 'account',
    description: 'The account reference',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiParam({
    name: 'workspace',
    description: 'The workspace reference',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The request is successfully processed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not permitted to service',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not permitted to endpoint',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'There is no matching record available',
  })
  @ApiResponse({
    status: HttpStatus.GATEWAY_TIMEOUT,
    description: 'Service is not connected',
  })
  @ApiResponse({
    status: HttpStatus.REQUEST_TIMEOUT,
    description: 'Request took too long to execute',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Problem within the service, check logs for details',
  })
  get(
    @Param('account') account: string,
    @Param('workspace') workspace: string,
  ) {
    this.logger.debug('get(): Enter');
    this.logger.debug(`get(): $account = ${account}`);
    this.logger.debug(`get(): $workspace = ${workspace}`);
    return this.workspaces.get(account, workspace);
  }

  /**
   * @async
   * @method remove
   * @description Remving an existing Woekspace
   * @param account {string} the account ID of the workspace
   * @param workspace {string} the workspace ID to remove
   * @returns {Promise<void>}
   */
  @Delete('accounts/:account/workspaces/:workspace')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags('Workspaces')
  @ApiOperation({
    summary: 'Removing a workspace',
    description: 'Removing a workspace if it is previously defined',
  })
  @ApiParam({
    name: 'workspace',
    description: 'The workspace reference',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The request is successfully processed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not permitted to service',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not permitted to endpoint',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'There is no matching record available',
  })
  @ApiResponse({
    status: HttpStatus.GATEWAY_TIMEOUT,
    description: 'Service is not connected',
  })
  @ApiResponse({
    status: HttpStatus.REQUEST_TIMEOUT,
    description: 'Request took too long to execute',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Problem within the service, check logs for details',
  })  
  async remove(@Param('account') account: string, @Param('workspace') workspace: string) {
    this.logger.debug('remove(): Enter');
    this.logger.debug(`remove(): $account = ${account}`);
    this.logger.debug(`remove(): $workspace = ${workspace}`);
    await this.workspaces.remove(account, workspace);
  }

  /**
   * @method update
   * @description Updating an existing workspace
   * @param account {string} the Account ID
   * @param workspace {string} the Workspace ID to update
   * @param request {WorkspaceUpdateObject} the request data struct for update
   * @returns {Promise<Workspace>}
   */
  @Put('accounts/:account/workspaces/:workspace')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiTags('Workspaces')
  @ApiOperation({
    summary: 'Update an existing workspace',
    description: 'Update an existing workspace with new data',
  })
  @ApiParam({
    name: 'account',
    description: 'The account ID to workspace is binded to',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiParam({
    name: 'workspace',
    description: 'The workspace the update is intended for',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'The request is successfully processed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not logged into system',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user is not allowed for this action',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The request is not properly formatted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The requested workspace is not available',
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description:
      "The service cannot be reached, network connectivity isn't available",
  })
  @ApiResponse({
    status: HttpStatus.REQUEST_TIMEOUT,
    description: 'The request took too long to process',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Problem encountered in service, check logs for further details',
  })
  update(
    @Param('account') account: string,
    @Param('workspace') workspace: string,
    @Body() request: WorkspaceUpdateObject,
  ) {
    this.logger.debug(`update(): Enter`);
    this.logger.debug(`update(): $account = ${account}`);
    this.logger.debug(`update(): $workspace = ${workspace}`);
    this.logger.debug(`update(): $request = ${request}`);
    return this.workspaces.update(account, workspace, request);
  }
}
