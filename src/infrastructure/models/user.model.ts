import { Attachment } from "src/domain/types/attachment.type";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { MemberModel } from "./member.model";
import { WorkspaceModel } from "./workspace.model";

/**
 * @class
 * @name UserModel 
 * @description The data model or users
 */
@Entity({name: 'users'})
export class UserModel {
    @PrimaryColumn()
    id: string;

    @Column({default: false})
    activated: boolean;

    @Column({ nullable: true })
    activatedOn: Date;

    @OneToMany(() => WorkspaceModel, (workspace) => workspace.admin)
    administrators: WorkspaceModel[];

    @Column('jsonb', { nullable: true })
    avatar: Attachment;

    @CreateDateColumn()
    createdOn: Date;

    @Column()
    email: string;

    @Column({default: true})
    enabled: true;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @UpdateDateColumn()
    lastUpdatedOn: Date;

    @OneToMany(() => MemberModel, (member) => member.user, {cascade: true})
    memberships: MemberModel[];

    @Column({nullable: true})
    mobile: string;
}