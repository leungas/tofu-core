import { Team } from '../entities/team.entity';

/**
 * @event TeamCreatedEvent
 * @description The event triggered when a team gets created
 * @author Mark Leung <leungas@gmail.com>
 */
export class TeamCreatedEvent {
  /**
   * @constructor
   * @param team {Team} the team that got created
   */
  constructor(public readonly team: Team) {}
}
