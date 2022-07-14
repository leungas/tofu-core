import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { Member } from './member.entity';

/**
 * @class
 * @name Team
 * @description The team of each workspace
 * @author Mark Leung <leungas@gmail.com>
 */
@ObjectType()
export class Team {
  /**
   * @property
   * @name id
   * @desrcription The ID of the record
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
  id: string;

  /**
   * @property
   * @name code
   * @description The reference code to bind within the workspace
   * @type {string}
   */
  @Field(() => String, {
    description: 'The reference code to bind within the workspace',
  })
  @ApiProperty({
    name: 'code',
    description: 'The reference code to bind within the workspace',
    type: 'string',
    example: 'EXAMPLE_TEAM',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  code: string;

  /**
   * @property
   * @name createdOn
   * @description The date record is created
   * @type {date}
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
   * @name lastUpdatedOn
   * @description The date record is updated
   * @type {date}
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
   * @name members
   * @descriptions The members within the team
   * @type {Member[]}
   */
  @Field(() => [Member], {
    defaultValue: [],
    description: 'The members within the team',
  })
  @ApiProperty({
    name: 'members',
    description: 'The members within the team',
    type: 'array',
    items: {
      type: 'Member',
    },
    example: [],
    readOnly: true,
  })
  members: Member[] = [];

  /**
   * @property
   * @name name
   * @description The name of the team
   * @type {string}
   */
  @Field(() => String, { description: 'The name of the team' })
  @ApiProperty({
    name: 'name',
    description: 'The name of the team',
    type: 'string',
    example: 'Some Team Name',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  name: string;
}
