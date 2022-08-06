import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEmail,
  IsIn,
  IsInstance,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { v4 as uuid } from 'uuid';
import { Attachment } from '../types/attachment.type';
import { Profile } from './profile.entity';

/**
 * @class
 * @name User
 * @description The structure for general user in application
 * @author Mark Leung <leungas@gmail.com>
 */
@ObjectType()
export class User {
  /**
   * @property
   * @name id
   * @description The ID of the record
   * @type {string}
   */
  @Field(() => String, { description: 'The ID of the record' })
  @ApiProperty({
    name: 'id',
    description: 'The ID of the record',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  id: string;

  /**
   * @property
   * @name activated
   * @description The activation state of the user
   * @type {string}
   */
  @Field(() => String, { description: 'The activation state of the user' })
  @ApiProperty({
    name: 'activated',
    description: 'The activation state of the user',
    type: 'boolean',
    default: false,
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  activated = false;

  /**
   * @property
   * @name activaredOn
   * @description The date record is activated
   * @type {Date}
   */
  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'The date record is activated',
  })
  @ApiProperty({
    name: 'activaredOn',
    description: 'The date record is activated',
    type: 'date',
    example: new Date().toISOString(),
    readOnly: true,
  })
  activaredOn?: Date;

  /**
   * @property
   * @name avatar
   * @description The avatar profile image
   * @type {Attachment}
   */
  @Field(() => Attachment, {
    nullable: true,
    description: 'The avatar profile image',
  })
  @ApiProperty({
    name: 'avatar',
    description: 'The avatar profile image',
    type: Attachment,
    example: {
      asset: 'some.file',
      contentType: 'application/json',
      original: 'some.original.name',
      resource: 'some container',
      type: 'asset',
    },
    required: false,
  })
  @IsInstance(Attachment)
  @IsOptional()
  avatar?: Attachment;

  /**
   * @property
   * @name createdOn
   * @description The date record is created
   * @type {Date}
   */
  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'The date record is created',
  })
  @ApiProperty({
    name: 'createdOn',
    description: 'The date record is created',
    type: 'date',
    example: new Date().toISOString(),
    readOnly: true,
  })
  createdOn?: Date;

  /**
   * @property
   * @name dob
   * @description The date of birth of the user
   * @type {date}
   */
  @Field(() => GraphQLISODateTime, {nullable: true, description: 'The date of birth of the user'})
  @ApiProperty({
    name: 'dob',
    description: 'The date of birth of the user',
    type: 'date',
    example: (new Date()).toISOString(),
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dob?: Date;

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
   * @name enabled
   * @description The state of the user
   * @type {boolean}
   */
  @Field(() => String, { description: 'The state of the user' })
  @ApiProperty({
    name: 'enabled',
    description: 'The state of the user',
    type: 'boolean',
    default: true,
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  enabled = true;

  /**
   * @property
   * @name firstName
   * @description The first name the user
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
   * @name gender
   * @description The gender of the user
   * @type {string}
   */
  @Field(() => String, {description: 'The gender of the user'})
  @ApiProperty({
    name: 'gender',
    description: 'The gender of the user',
    type: 'string',
    default: 'unknown',
    example: 'unknown',
    required: false,
  })
  @IsIn(['male', 'female', 'unknown'])
  @IsOptional()
  gender?: 'male' | 'female' | 'unknown' = 'unknown';

  /**
   * @property
   * @name introduction
   * @description The introduction profile of the user
   * @type {string}
   */
  @Field(() => String, {nullable: true, description: 'The introduction profile of the user'})
  @ApiProperty({
    name: 'introduction',
    description: 'The introduction profile of the user',
    type: 'string',
    example: 'John Smith\'s personal profile...',
    required: false,
  })
  @IsOptional()
  introduction?: string;

  /**
   * @property
   * @name lastName
   * @description The last name the user
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

  /**
   * @property
   * @name lastUpdatedOn
   * @description The date record is updated
   * @type {Date}
   */
  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'The date record is updated',
  })
  @ApiProperty({
    name: 'lastUpdatedOn',
    description: 'The date record is updated',
    type: 'date',
    example: new Date().toISOString(),
    readOnly: true,
  })
  lastUpdatedOn?: Date;

  /**
   * @property
   * @name mobile
   * @description The mobile the user
   * @type {string}
   */
  @Field(() => String, { description: 'The mobile of the user' })
  @ApiProperty({
    name: 'mobile',
    description: 'The mobile of the user',
    type: 'string',
    example: '12345678',
    required: true,
  })
  @IsPhoneNumber()
  @IsDefined()
  mobile?: string;

  /**
   * @property
   * @name profile
   * @description The list of profiles for the user
   * @type {Profile[]}
   */
  @Field(() => [Profile], {nullable: true, defaultValue: [], description: 'The list of profiles for the user'})
  @ApiProperty({
    name: 'profile',
    description: 'The list of profiles for the user',
    type: 'array',
    items: {
      type: 'Profile',
    },
    default: [],
    example: [],
    required: false,
  })
  @IsInstance(Profile, {each: true})
  @IsOptional()
  profile: Profile[] = [];
}
