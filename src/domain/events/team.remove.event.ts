import { Team } from '../entities/team.entity';

/**
 * @event TeamRemovedEvent
 * @description The event triggered when a team gets removed
 * @author Mark Leung <leungas@gmail.com>
 */
export class TeamRemovedEvent {
  /**
   * @constructor
   * @param team {Team} the team that got created
   */
  constructor(public readonly team: Team) {}
}
