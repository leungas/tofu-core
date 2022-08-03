import { Team } from '../entities/team.entity';

/**
 * @event TeamReassignedEvent
 * @description The event triggered when a team gets reassigned with members
 * @author Mark Leung <leungas@gmail.com>
 */
export class TeamReassignedEvent {
  /**
   * @constructor
   * @param team {Team} the team that got created
   */
  constructor(public readonly team: Team) {}
}
