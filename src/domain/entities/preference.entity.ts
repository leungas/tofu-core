import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { v4 as uuid } from 'uuid';

/**
 * @class
 * @name Preference
 * @description The preference offer by any application to store into users
 * @author Mark Leung <leungas@gmail.com>
 */
@ObjectType()
export class Preference {
  /**
   * @property
   * @name id
   * @description The id for the record
   * @type {string}
   */
  @Field(() => String, { nullable: true, description: 'The ID for the record' })
  @ApiProperty({
    name: 'id',
    description: 'The ID for the record',
    type: 'string',
    example: uuid(),
    readOnly: true,
  })
  id?: string;

  /**
   * @property
   * @name application
   * @description The application provided this preference
   * @type {string}
   */
  @Field(() => String, {
    description: 'The application provided this preference',
  })
  @ApiProperty({
    name: 'application',
    description: 'The application provided this preference',
    type: 'string',
    example: 'some application',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  application: string;

  /**
   * @property
   * @name code
   * @description The code for referencing in profiles
   * @type {string}
   */
  @Field(() => String, { description: 'The code for referencing in profiles' })
  @ApiProperty({
    name: 'code',
    description: 'The code for preference in profiles',
    type: 'string',
    example: 'locale',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  code: string;

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
   * @name defaultValue
   * @description The default value to assign if applicable
   * @type {string}
   */
  @Field(() => String, {
    description: 'The default value to assign if applicable',
  })
  @ApiProperty({
    name: 'defaultValue',
    description: 'The default value to assign if applicable',
    type: 'string',
    example: JSON.stringify('en'),
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  defaultValue: string;

  /**
   * @proeprty
   * @name description
   * @description The details for the property
   * @type {string}
   */
  @Field(() => String, {
    nullable: true,
    description: 'The details for the property',
  })
  @ApiProperty({
    name: 'description',
    description: 'The details for the property',
    type: 'stirng',
    example: 'The locale for the user',
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  /**
   * @property
   * @name isAssignable
   * @description Flag to indicate the preference is assignable to a new user
   * @type {boolean}
   */
  @Field(() => Boolean, {
    nullable: true,
    defaultValue: false,
    description: 'Flag to indicate the preference is assignable to a new user',
  })
  @ApiProperty({
    name: 'isAssignable',
    description: 'Flag to indicate the preference is assignable to a new user',
    type: 'boolean',
    default: false,
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAssignable = false;

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
}
