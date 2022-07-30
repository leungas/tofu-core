import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberModel } from './member.model';
import { WorkspaceModel } from './workspace.model';

/**
 * @class
 * @name TeamModel
 * @description The team data model in layer
 * @author Mark Leung <leungas@gmail.com>
 */
@Entity({ name: 'teams' })
export class TeamModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  lastUpdatedOn: Date;

  @OneToMany(() => MemberModel, (member) => member.team, {
    cascade: true,
    eager: true,
  })
  members: MemberModel[];

  @Column()
  name: string;

  @ManyToOne(() => WorkspaceModel, (workspace) => workspace.teams)
  owner: WorkspaceModel;
}
