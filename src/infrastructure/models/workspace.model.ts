import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AccountModel } from "./account.model.";
import { TeamModel } from "./team.model";
import { UserModel } from "./user.model";

/**
 * @class
 * @name WorkspaceModel
 * @description The workspace data model 
 * @author Mark Leung <leungas@gmail.com>
 */
@Entity({name: 'workspaces'})
export class WorkspaceModel {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => AccountModel, (account) => account.workspaces, {eager: true})
    account: AccountModel;

    @ManyToOne(() => UserModel, (admin) => admin.administrators, {eager: true})
    admin: UserModel;

    @CreateDateColumn()
    createdOn: Date;

    @Column({default: true})
    enabled: boolean;

    @UpdateDateColumn()
    lastUpdatedOn: Date;

    @Column()
    name: string;

    @OneToMany(() => TeamModel, (team) => team.owner, {cascade: true, eager: true})
    teams: TeamModel[];
}