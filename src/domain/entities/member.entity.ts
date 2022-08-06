import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { User } from './user.entity';

/**
 * @class
 * @name Member
 * @description The member within a team which is also used in RBAC
 * @author Mark Leung <leungas@gmail.com>
 */
@ObjectType()
export class Member {
  /**
   * @property
   * @name id
   * @description The ID of the member
   * @type {string}
   */
  @Field(() => Int, { nullable: true, description: 'The ID of the member' })
  @ApiProperty({
    name: 'id',
    description: 'The ID of the member',
    type: 'number',
    example: 1,
    readOnly: true,
  })
  id?: number;

  /**
   * @property
   * @name createdOn
   * @description The date record is created
   * @author Mark Leung <leungas@gmail.com>
   */
  @Field(() => GraphQLISODateTime, {
    defaultValue: new Date(),
    description: 'The date record is created',
  })
  @ApiProperty({
    name: 'createdOn',
    description: 'The date record is created',
    type: 'date',
    example: new Date().toISOString(),
    readOnly: true,
  })
  createdOn: Date = new Date();

  /**
   * @property
   * @name enabled
   * @description The flag controller the member status in team
   * @type {boolean}
   */
  @Field(() => Boolean, {
    nullable: true,
    description: 'The flag controller the member status in team',
  })
  @ApiProperty({
    name: 'id',
    description: 'The flag controller the member status in team',
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
   * @name lastUpdated
   * @description The date record is created
   * @author Mark Leung <leungas@gmail.com>
   */
  @Field(() => GraphQLISODateTime, {
    defaultValue: new Date(),
    description: 'The date record is updated',
  })
  @ApiProperty({
    name: 'lastUpdated',
    description: 'The date record is updated',
    type: 'date',
    example: new Date().toISOString(),
    readOnly: true,
  })
  lastUpdated?: Date;

  /**
   * @property
   * @name role
   * @description What role does this user play in the team
   * @type {string}
   */
  @Field(() => String, {description: 'What role does this user play in the team?'})
  @ApiProperty({
    name: 'role',
    description: 'What role does this user play in the team?',
    type: 'string',
    example: 'Regular member',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  role: string;

  /**
   * @property
   * @name user
   * @description The user linked as member
   * @type {User}
   */
  @Field(() => User, { description: 'The user linked as member' })
  @ApiProperty({
    name: 'user',
    description: 'The user linked as member',
    type: User,
    example: {
      id: uuid(),
      activated: true,
      activatedOn: new Date().toISOString(),
      createdOn: new Date().toISOString(),
      email: 'john.smith@costono.com',
      enabled: true,
      firstName: 'John',
      lastName: 'Smith',
    },
    readOnly: true,
  })
  user: User;
}
