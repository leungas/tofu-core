import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * @class
 * @name SystemTeamModel
 * @description The model for system defined teams
 * @author Mark Leung <leungas@gmail.com>
 */
@Entity({name: 'system_teams'})
export class SystemTeamModel {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({default: false})
    autoAssign: boolean;

    @Column()
    code: string;

    @CreateDateColumn()
    createdOn: Date;

    @Column()
    name: string;
}