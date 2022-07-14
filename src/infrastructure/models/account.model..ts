import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { WorkspaceModel } from "./workspace.model";

/**
 * @class
 * @name AccountModel
 * @description The data model for account base data
 * @author Mark Leung <leungas@gmail.com>
 */
@Entity({name: 'accounts'})
export class AccountModel {
    @PrimaryColumn()
    id: string;

    @CreateDateColumn()
    createdOn: Date;

    @Column('jsonb',{default: {}})
    settings: Map<string, string>;

    @OneToMany(() => WorkspaceModel, (workspace) => workspace.account, {cascade: true})
    workspaces: WorkspaceModel[];
}