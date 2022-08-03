import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserModel } from './user.model';

/**
 * @class
 * @name InvitiationModel
 * @description the data model for the invitation data set
 * @author Mark Leung <leungas@gmail.com>
 */
@Entity({ name: 'invitations' })
export class InvitiationModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activationCode: string;

  @Column({ nullable: true })
  consumedOn: Date;

  @CreateDateColumn()
  createdOn: Date;

  @Column()
  email: string;

  @UpdateDateColumn()
  lastUpdatedOn: Date;

  @OneToOne(() => UserModel, (user) => user.invitation, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  linkedUser: UserModel;
}
