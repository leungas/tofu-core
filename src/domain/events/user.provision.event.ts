import { User } from '../entities/user.entity';

/**
 * @event UserProvisionedEvent
 * @description the event triggered when user is provisioned.
 * @author Mark Leung <leungas@gmail.com>
 */
export class UserProvisionedEvent {
  /**
   * @constructor
   * @param user {User} the user provisioned and activated
   */
  constructor(public readonly user: User) {}
}
