import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInstance, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { User } from "src/domain/entities/user.entity";
import { v4 as uuid } from 'uuid';

/**
 * @class
 * @name WorkspaceCreateObject
 * @description The create structure of a workspace
 * @author Mark Leung <leungas@gmail.com>
 */
@InputType()
export class WorkspaceCreateObject {
    /**
     * @property
     * @name account
     * @description The account holding the workspace',
     * @type {string}
     */    
     @Field(() => String, {description: 'The account holding the workspace'})
     @ApiProperty({
         name: 'account',
         description: 'The account holding the workspace',
         type: 'string',
         example: uuid(),
         required: true,
     })
     @IsUUID()
     @IsDefined()
     account: string;

     /**
      * @property
      * @name admin
      * @description The admin of this workspace
      * @type {User}
      */
     @Field(() => User, {nullable: true, description: 'The admin of this workspace'})
     @ApiProperty({
        name: 'admin',
        description: 'The admin of this workspace',
        type: User,
        example: {
            id: uuid(),
            activated: true,
            email: 'john.smith@costono.com',
            enabled: true,
            firstName: 'John',
            lastName: 'Smith',
        },
        required: false,
     })
     @IsInstance(User)
     @IsOptional()
     admin?: User;

    /**
     * @property
     * @name name
     * @description The name of the workspace
     * @type {string}
     */          
    @Field(() => String, {description: 'The name of the workspace'})
    @ApiProperty({
        name: 'name',
        description: 'The name of the workspace',
        type: 'string',
        example: 'Workspace name',
        required: true,
    })
    @IsNotEmpty()
    @IsDefined()
    name: string;    
}