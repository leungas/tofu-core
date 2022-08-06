import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PreferenceModel } from './preference.model';
import { UserModel } from './user.model';

/**
 * @class
 * @name ProfileModel
 * @description The profile data schema
 * @author Mark Leung <leungas@gmail.com>
 */
@Entity({ name: 'profiles' })
export class ProfileModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  lastUpdatedOn: Date;

  @ManyToOne(() => UserModel, (owner) => owner.profile)
  owner: UserModel;

  @ManyToOne(() => PreferenceModel, (preference) => preference.profiles)
  preference: PreferenceModel;

  @Column()
  value: string;
}
