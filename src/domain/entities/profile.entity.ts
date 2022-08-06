import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Preference } from './preference.entity';
import { v4 as uuid } from 'uuid';
import { IsDefined, IsInstance, IsNotEmpty } from 'class-validator';

/**
 * @class
 * @name Profile
 * @description The profile link for a user to preference
 * @author Mark Leung <leungas@gmail.com>
 */
@ObjectType()
export class Profile {
  /**
   * @property
   * @name id
   * @description The ID of the record
   * @type {string}
   */
  @Field(() => String, { nullable: true, description: 'The ID of the record' })
  @ApiProperty({
    name: 'id',
    description: 'The ID of the record',
    type: 'string',
    example: uuid(),
    readOnly: true,
  })
  id?: string;

  /**
   * @property
   * @name createdOn
   * @description The date when record is created
   * @type {Date}
   */
  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'The date when record is created',
  })
  @ApiProperty({
    name: 'createdOn',
    description: 'The date when record is created',
    type: 'date',
    example: new Date().toISOString(),
    readOnly: true,
  })
  createdOn?: Date;

  /**
   * @property
   * @name lastUpdatedOn
   * @description The date when record is created
   * @type {Date}
   */
  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'The date when record is updated',
  })
  @ApiProperty({
    name: 'lastUpdatedOn',
    description: 'The date when record is updated',
    type: 'date',
    example: new Date().toISOString(),
    readOnly: true,
  })
  lastUpdatedOn?: Date;

  /**
   * @property
   * @name preference
   * @description The preference for linked for the profile entry
   * @type {Preference}
   */
  @Field(() => Preference, {
    description: 'The preference for linked for the profile entry',
  })
  @ApiProperty({
    name: 'preference',
    description: 'The preference for linked for the profile entry',
    type: Preference,
    example: {
      id: uuid(),
      application: 'core',
      coee: 'locale',
      createdOn: new Date(),
      defaultValue: 'en',
      description: 'The locale of the user',
      isAssignable: true,
      lastUpdatedOn: new Date(),
    },
    required: true,
  })
  @IsInstance(Preference)
  @IsDefined()
  preference: Preference;

  /**
   * @property
   * @name value
   * @description The value for the preference set for the user
   * @type {string}
   */
  @Field(() => String, {
    description: 'The value for the preference set for the user',
  })
  @ApiProperty({
    name: 'value',
    description: 'The value for the preference set for the user',
    type: 'string',
    example: 'en',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  value: string;
}
