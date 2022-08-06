import { Field, GraphQLISODateTime } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { v4 as uuid } from 'uuid';

/**
 * @class
 * @name ResourceType
 * @description The resource grouping applicable for access control
 * @author Mark Leung <leungas@gmail.com>
 */
export class ResourceType {
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
   * @description The resource category owning application
   * @type {string]}
   */
  @Field(() => String, {
    description: 'The resource category owning application',
  })
  @ApiProperty({
    name: 'application',
    description: 'The resource category owning application',
    type: 'string',
    example: 'workspace',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  application: string;

  /**
   * @property
   * @name category
   * @description The resource category for the type
   * @type {string]}
   */
  @Field(() => String, { description: 'The resource category for the type' })
  @ApiProperty({
    name: 'category',
    description: 'The resource category for the type',
    type: 'string',
    example: 'user',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  category: string;

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
   * @name description
   * @description The description for the reosurce we are using
   * @type {string}
   */
  @Field(() => String, {
    description: 'The description for the reosurce we are using',
  })
  @ApiProperty({
    name: 'description',
    description: 'The description for the reosurce we are using',
    type: 'string',
    example: 'Some resource details',
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  description?: string;

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
   * @name permissibles
   * @description The permissions enabled for the resource
   * @type {string[]}
   */
  @Field(() => [String], {
    defaultValue: ['create', 'read', 'update', 'delete'],
    description: 'The permissions enabled for the resource',
  })
  @ApiProperty({
    name: 'permissibles',
    description: 'The permissions enabled for the resource',
    type: 'array',
    items: {
      type: 'stirng',
    },
    default: ['create', 'read', 'update', 'delete'],
    example: ['create', 'read', 'update', 'delete'],
    required: false,
  })
  @IsNotEmpty({ each: true })
  @IsOptional()
  permissibles: string[] = ['create', 'read', 'update', 'delete'];
}
