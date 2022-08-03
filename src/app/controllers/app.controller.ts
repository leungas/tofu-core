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
  ApiOkResponse,
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
import { FindManyOptions } from 'typeorm';
import { WorkspaceModel } from '../../infrastructure/models/workspace.model';
import { TeamCreateObject } from '../dto/team.create.dto';
import { TeamService } from '../../domain/services/team.service';
import { TeamUpdateObject } from '../dto/team.update.dto';

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
   * @param teams {TeamService} the teams related services
   * @param workspaces {WorkspaceSerivce} the workspace related services
   */
  constructor(
    private readonly system: SystemService,
    private readonly teams: TeamService,
    private readonly workspaces: WorkspaceService,
  ) {}

  /**
   * @method healthcheck
   * @description the getting our health check done
   * @returns {string}
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiTags('System')
  @ApiOperation({
    summary: 'System Healthcheck',
    description:
      'To collect the system heartbeat to ensure service is operating',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The request been processed successfully',
  })
  @ApiResponse({
    status: HttpStatus.GATEWAY_TIMEOUT,
    description: 'The service cannot be reached',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Problem with service, check logs for further details',
  })
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
   * @method fetch
   * @description get teams belong to a workspace
   * @param account {string} the ID of account to look for
   * @param workspace {string} the ID of workspace to look for
   * @returns {Team[]}
   */
  @Get('/accounts/:account/workspaces/:workspace/teams')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Teams')
  @ApiOperation({
    summary: 'Getting teams belong to a workspace',
    description:
      'Fetching teams owned by a specific workspace with the member data',
  })
  @ApiParam({
    name: 'account',
    description: 'The ID of the account to search',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiParam({
    name: 'workspace',
    description: 'The workspace ID for us to search teams under',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request is properly processed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not logged in',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not allowed to access',
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'The service is not available, try again later',
  })
  @ApiOkResponse({
    status: HttpStatus.REQUEST_TIMEOUT,
    description: 'It took too long for the request, please try again',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Service encountered problem, please check logs for details',
  })
  fetch(
    @Param('account') account: string,
    @Param('workspace') workspace: string,
  ) {
    this.logger.debug(`fetch(): Enter`);
    this.logger.debug(`fetch(): $account = ${account}`);
    this.logger.debug(`fetch(): $workspace = ${workspace}`);
    return this.teams.search(account, workspace);
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

  @Post('accounts/:account/workspaces/:workspaces/teams')
  @HttpCode(HttpStatus.CREATED)
  @ApiTags('Teams')
  @ApiOperation({
    summary: 'Create a new team',
    description: 'Creating a new team for an existing workspace',
  })
  @ApiParam({
    name: 'account',
    description: 'The account owning the workspace',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiParam({
    name: 'workspace',
    description: 'The workspace the team binds with',
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
    description: 'User is not logged into the system',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have rights to create new team',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Submitted request is invalid',
  })
  @ApiResponse({
    status: HttpStatus.PRECONDITION_FAILED,
    description: 'The required workspace is not available',
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'The service is not connected or unrearchable',
  })
  @ApiResponse({
    status: HttpStatus.REQUEST_TIMEOUT,
    description: 'The request took too long to process',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Problem with service, check logs for more details',
  })
  register(
    @Param('account') account: string,
    @Param('workspace') workspace: string,
    @Body() request: TeamCreateObject,
  ) {
    this.logger.debug(`register(): Enter`);
    this.logger.debug(`register(): $account = ${account}`);
    this.logger.debug(`register(): $workspace = ${workspace}`);
    this.logger.debug(`register(): $request = ${JSON.stringify(request)}`);
    return this.teams.create(account, workspace, request);
  }

  @Put('accounts/:account/workspaces/:workspace/teams/:team')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiTags('Teams')
  @ApiOperation({
    summary: 'Updating data for an existing team',
    description:
      'Update data for a team that is already defined, but it will not do any update on members',
  })
  @ApiParam({
    name: 'account',
    description: 'The account ID linked to workspace',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiParam({
    name: 'workspace',
    description: 'The workspace ID linked to team',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiParam({
    name: 'team',
    description: 'The team ID to update',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiBody({})
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'The request is successfully processed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not logged into the system',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have rights to create new team',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Submitted request is invalid',
  })
  @ApiResponse({
    status: HttpStatus.PRECONDITION_FAILED,
    description: 'The required workspace is not available',
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'The service is not connected or unrearchable',
  })
  @ApiResponse({
    status: HttpStatus.REQUEST_TIMEOUT,
    description: 'The request took too long to process',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Problem with service, check logs for more details',
  })
  reregister(
    @Param('account') account: string,
    @Param('workspace') workspace: string,
    @Param('team') team: string,
    @Body() request: TeamUpdateObject,
  ) {
    this.logger.debug(`reregister(): Enter`);
    this.logger.debug(`reregister(): $account = ${account}`);
    this.logger.debug(`reregister(): $workspace = ${workspace}`);
    this.logger.debug(`reregister(): $team = ${team}`);
    return this.teams.update(account, workspace, team, request);
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
  async remove(
    @Param('account') account: string,
    @Param('workspace') workspace: string,
  ) {
    this.logger.debug('remove(): Enter');
    this.logger.debug(`remove(): $account = ${account}`);
    this.logger.debug(`remove(): $workspace = ${workspace}`);
    await this.workspaces.remove(account, workspace);
  }

  /**
   * @method search
   * @description Search for appropriate workspaces
   * @param account {string} the account ID for searching scope
   * @param filter {FindManyOptions} the search filter applicable
   * @returns {Promise<Workspace[]>}
   */
  @Post('search/account/:account/workspaces')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Search')
  @ApiOperation({
    summary: 'List workspaces',
    description:
      'Show workspaces for administrators based on specific search pareameters',
  })
  @ApiParam({
    name: 'account',
    description: 'The account ID to provide searching',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiBody({})
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
  search(
    @Param('account') account: string,
    @Body() filter: FindManyOptions<WorkspaceModel>,
  ) {
    this.logger.debug('search(): Enter');
    this.logger.debug(`search(): $account = ${account}`);
    this.logger.debug(`search(): $filter = ${JSON.stringify(filter)}`);
    return this.workspaces.search(account, filter);
  }

  /**
   * @method unregister
   * @description Remove team from service
   * @param account {string} the account ID to search for
   * @param workspace {string} the workspace ID to search for
   * @param team {string} the ID of team to remove
   * @returns {void}
   */
  @Delete('accounts/:account/workspaces/:workspace/teams/:team')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags('Teams')
  @ApiOperation({
    summary: 'Removing a team',
    description: 'Remove a team that is previously defined',
  })
  @ApiParam({
    name: 'account',
    description: 'The account ID the workspace is owned by',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiParam({
    name: 'workspace',
    description: 'The workspace ID that the team is from',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiParam({
    name: 'tean',
    description: 'The team ID which we want to remove',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The response is properly processed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not logged in',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not allowed t access the feature',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The request team is not available',
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Service is not reachable, try again later',
  })
  @ApiResponse({
    status: HttpStatus.REQUEST_TIMEOUT,
    description: 'Request took too long to process, please try again',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Problem detected in service, please check logs for details',
  })
  unregister(
    @Param('account') account: string,
    @Param('workspace') workspace: string,
    @Param('team') team: string,
  ) {
    this.logger.debug(`unregister(): Enter`);
    this.logger.debug(`unregister(): $account = ${account}`);
    this.logger.debug(`unregister(): $workspace = ${workspace}`);
    this.logger.debug(`unregister(): $team = ${team}`);
    this.teams.remove(account, workspace, team);
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
