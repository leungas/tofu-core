import { AccountModel } from './account.model.';
import { MemberModel } from './member.model';
import { SystemTeamModel } from './system-team.model';
import { TeamModel } from './team.model';
import { UserModel } from './user.model';
import { WorkspaceModel } from './workspace.model';

/**
 * @const models
 * @description The models wired to the service
 * @author Mark Leung <leungas@gmail.com>
 */
export const models = [
  AccountModel,
  MemberModel,
  SystemTeamModel,
  TeamModel,
  UserModel,
  WorkspaceModel,
];
