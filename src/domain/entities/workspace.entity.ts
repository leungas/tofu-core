import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { v4 as uuid } from 'uuid';
import { Account } from './account.entity';
import { Team } from './team.entity';
import { User } from './user.entity';

/**
 * @class
 * @name Workspace
 * @description The entity of holding on projects
 */
@ObjectType()
export class Workspace {
  /**
   * @property
   * @name id
   * @description The ID of the workspace
   * @type {string}
   */
  @Field(() => String, {
    nullable: true,
    description: 'The ID of the workspace',
  })
  @ApiProperty({
    name: 'id',
    description: 'The ID of the workspace',
    type: 'string',
    example: uuid(),
    readOnly: true,
  })
  id?: string;

  /**
   * @property
   * @name account
   * @description The account holding the workspace',
   * @type {string}
   */
  @Field(() => String, { description: 'The account holding the workspace' })
  @ApiProperty({
    name: 'account',
    description: 'The account holding the workspace',
    type: 'string',
    example: {
      id: uuid(),
      createdOn: new Date().toISOString(),
      settings: {},
    },
    required: true,
  })
  @IsUUID()
  @IsDefined()
  account: Account;

  /**
   * @property
   * @name admin
   * @description The admin user linked to the workspace
   * @type {User}
   */
  @Field(() => User, { description: 'The admin user linked to the workspace' })
  @ApiProperty({
    name: 'admin',
    description: 'The admin user linked to the workspace',
    type: User,
    example: {
      id: uuid(),
      activated: true,
      email: 'john.smith@costono.com',
      enabled: true,
      firstName: 'John',
      lastName: 'Smith',
    },
    readOnly: true,
  })
  admin: User;

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
  createdOn: Date;

  /**
   * @property
   * @name enabled
   * @description The working state of the workspace
   * @type {boolean}
   */
  @Field(() => Boolean, {
    defaultValue: true,
    description: 'The working state of the workspace',
  })
  @ApiProperty({
    name: 'enabled',
    description: 'The working state of the workspace',
    type: 'boolean',
    default: true,
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean = true;

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
  lastUpdatedOn: Date;

  /**
   * @property
   * @name name
   * @description The name of the workspace
   * @type {string}
   */
  @Field(() => String, { description: 'The name of the workspace' })
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

  /**
   * @property
   * @name teams
   * @description The teams available withon the workspace
   * @type {Team[]}
   */
  @Field(() => [Team], {
    defaultValue: [],
    description: 'The teams available withon the workspace',
  })
  @ApiProperty({
    name: 'teams',
    description: 'The teams available withon the workspace',
    type: 'array',
    items: {
      type: 'Team',
    },
    example: [],
    readOnly: true,
  })
  teams: Team[] = [];
}
