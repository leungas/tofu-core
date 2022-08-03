import { CapabilityService } from './capability.service';
import { SystemService } from './system.service';
import { TeamService } from './team.service';
import { WorkspaceService } from './workspace.service';

/**
 * @const services
 * @description The services available in business logic
 * @author Mark Leung <leungas@gmail.com>
 */
export const services = [
  SystemService,
  // CapabilityService, # passivated for demo
  TeamService,
  WorkspaceService,
];
