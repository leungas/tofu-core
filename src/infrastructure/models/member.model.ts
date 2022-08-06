import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TeamModel } from './team.model';
import { UserModel } from './user.model';

@Entity({ name: 'members' })
export class MemberModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  createdOn: Date;

  @Column({ default: true })
  enabled: boolean;

  @UpdateDateColumn()
  lastUpdatedOn: Date;

  @Column()
  role: string;

  @ManyToOne(() => TeamModel, (team) => team.members)
  team: TeamModel;

  @ManyToOne(() => UserModel, (user) => user.memberships, { eager: true })
  user: UserModel;
}
