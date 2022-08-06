import { profile } from "console";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProfileModel } from "./profile.model";

/**
 * @class
 * @name PreferenceModel
 * @description The preference data storage schema
 * @author Mark Leung <leungas@gmail.com>
 */
@Entity({name: 'preferences'})
export class PreferenceModel {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    application: string;

    @Column()
    code: string;

    @CreateDateColumn()
    createdOn: Date;

    @Column()
    defaultValue: string;

    @Column({nullable: true})
    description?: string;

    @Column({default: false})
    isAssignable: boolean;

    @UpdateDateColumn()
    lastUpdatedOn: Date;

    @OneToMany(() => ProfileModel, (profile) => profile.preference)
    profiles: ProfileModel[];
    
}
