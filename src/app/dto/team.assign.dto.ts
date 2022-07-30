import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsDefined,
  IsEmail,
  IsInstance,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { v4 as uuid } from 'uuid';

/**
 * @class
 * @name UserDataObject
 * @description The user data object for input
 * @author Mark Leung <leungas@gmail.com>
 */
@InputType()
export class UserDataObject {
  /**
   * @property
   * @name id
   * @description The id of the user
   * @type {string}
   */
  @Field(() => String, { description: 'The id of the user' })
  @ApiProperty({
    name: 'id',
    description: 'The id of the user',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @IsUUID()
  @IsDefined()
  id: string;

  /**
   * @property
   * @name email
   * @description The email of the user
   * @type {string}
   */
  @Field(() => String, { description: 'The email of the user' })
  @ApiProperty({
    name: 'email',
    description: 'The email of the user',
    type: 'string',
    example: 'john.smith@costono.com',
    required: true,
  })
  @IsEmail()
  @IsDefined()
  email: string;

  /**
   * @property
   * @name firstName
   * @description Teh first name of the user
   * @type {string}
   */
  @Field(() => String, { description: 'The first name of the user' })
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
   * @description Teh last name of the user
   * @type {string}
   */
  @Field(() => String, { description: 'The last name of the user' })
  @ApiProperty({
    name: 'lastName',
    description: 'The last name of the user',
    type: 'string',
    example: 'Smith',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  lastName: string;
}

/**
 * @class
 * @name UserDataObject
 * @description The user data object for input
 * @author Mark Leung <leungas@gmail.com>
 */
@InputType()
export class TeamAssignObject {
  /**
   * @proeprty
   * @name members
   * @description The members of the team
   * @type {UserDataObject[]}
   */
  @Field(() => [UserDataObject], {
    defaultValue: [],
    description: 'The members of the team',
  })
  @ApiProperty({
    name: 'members',
    description: 'The members of the team',
    type: 'array',
    items: {
      type: 'UserDataObject',
    },
    example: [],
    required: true,
  })
  @IsInstance(UserDataObject, { each: true })
  @ArrayMinSize(1)
  @IsDefined()
  members: UserDataObject[] = [];
}
