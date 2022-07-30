import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';
import { v4 as uuid } from 'uuid';

/**
 * @class
 * @name Invitiation
 * @description The object represent an invitation for user to join the workspace.
 * @author Mark Leung <leungas@gmail.com>
 */
@ObjectType()
export class Invitation {
  /**
   * @property
   * @name id
   * @description The ID of the invitation
   * @type {string}
   */
  @Field(() => String, { description: 'The ID of the invitation' })
  @ApiProperty({
    name: 'id',
    description: 'The ID of the invitation',
    type: 'string',
    example: uuid(),
    readOnly: true,
  })
  id: string;

  /**
   * @property
   * @name activationCode
   * @description The activation code to use for the invitation
   * @type {string}
   */
  @Field(() => String, {description: 'The activation code to use the invitation'})
  @ApiProperty({
    name: 'activationCode',
    description: 'The activation code to use for the invitation',
    type: 'string',
    example: uuid(),
    readOnly: true,
  })
  activationCode: string = uuid();

  /**
   * @property
   * @name consumedOn
   * @description The date this invitation to consume
   * @type {date}
   */
  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'The date this invitation to consume',
  })
  @ApiProperty({
    name: 'consumedOn',
    description: 'The date the invitation is consumed',
    type: 'date',
    example: new Date().toISOString(),
    readOnly: true,
  })
  consumedOn?: Date;

  /**
   * @property
   * @name createdOn
   * @description The date this record is created
   * @type {date}
   */
  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'The date this record is created',
  })
  @ApiProperty({
    name: 'createdOn',
    description: 'The date this record is created',
    type: 'date',
    example: new Date().toISOString(),
    readOnly: true,
  })
  createdOn: Date;

  /**
   * @property
   * @name email
   * @description the email this invitation is for
   * @type {string}
   */
  @Field(() => String, { description: 'The email this invitation is for' })
  @ApiProperty({
    name: 'email',
    description: 'The email this invitation is for',
    type: 'string',
    example: 'john.smith@costono.com',
    required: true,
  })
  @IsEmail()
  @IsDefined()
  email: string;

  /**
   * @property
   * @name lastUpdatedOn
   * @description The date when this record is last changed
   * @type {date}
   */
  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'The date the record is last updated',
  })
  @ApiProperty({
    name: 'lastUpdatedOn',
    description: 'The date the record is last changed',
    type: 'date',
    example: new Date().toISOString(),
    readOnly: true,
  })
  lastUpdatedOn?: Date;  
}
