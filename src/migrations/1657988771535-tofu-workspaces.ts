import { SystemTeamModel } from 'src/infrastructure/models/system-team.model';
import { FindManyOptions, MigrationInterface, QueryRunner } from 'typeorm';

/**
 * @migration
 * @description adding new default team for generation
 * @author Mark Leung <leungas@gmail.com>
 */
export class tofuWorkspaces1657988771535 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const team = Object.assign(new SystemTeamModel(), {
      autoAssign: true,
      code: 'ADMINISTRATORS',
      name: 'Administrators',
    });
    queryRunner.manager.save(team);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const filter: FindManyOptions<SystemTeamModel> = {
      where: {
        code: 'ADMINISTRATORS',
        autoAssign: true,
      },
    };
    await queryRunner.manager.remove(SystemTeamModel, filter);
  }
}
