import { AccountModelRepository } from './account.repository';
import { InvitationModelRepository } from './invitation.repository';
import { TeamModelRepository } from './team.repository';
import { UserModelRepository } from './user.repository';
import { WorkspaceModelRepository } from './workspace.repository';

/**
 * @const repositories
 * @description The linkable to data access logic
 * @author Mark Leung <leungas@gmail.com>
 */
export const repositories = [
  AccountModelRepository,
  InvitationModelRepository,
  TeamModelRepository,
  UserModelRepository,
  WorkspaceModelRepository,
];
