import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsUUID } from "class-validator";
import { v4 as uuid } from 'uuid';

/**
 * @class
 * @name InvitationConsumeObject
 * @description The object for running consuming invitation
 * @author Mark Leung <leungas@gmail.com>
 */
@InputType()
export class InvitationConsumeObject {

    /**
     * @property
     * @name activationCode
     * @description The activation code for consunption
     * @type {string}
     */
    @Field(() => String, {description: 'The activation code for consumption'})
    @ApiProperty({
        name: 'activationCode',
        description: 'The activation code for consumption',
        type: 'string',
        example: uuid(),
        required: true,
    })
    @IsUUID()
    @IsDefined()
    activationCode: string;

    /**
     * @property
     * @name firstName
     * @description The first name of the user
     * @type {string}
     */
    @Field(() => String, {description: 'The first name of the user'})
    @ApiProperty({
        name: 'firstName',
        description: 'The first name of the user',
        type: 'string',
        example: 'John',
        required: true,
    })
    @IsNotEmpty()
    @IsDefined()
    firstName: string;

    /**
     * @property
     * @name lastName
     * @description The last name of the user
     * @type {string}
     */    
    @Field(() => String, {description: 'The last name of the user'})
    @ApiProperty({
        name: 'lastName',
        description: 'The last name of the user',
        type: 'stirng',
        example: 'Smith',
        required: true,
    })
    @IsNotEmpty()
    @IsDefined()
    lastName: string;
}