import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInstance, IsNotEmpty, IsOptional } from 'class-validator';
import { MemberCreateObject } from './member.create.dto';

/**
 * @class
 * @name TeamCreateObject
 * @description The data structure for creating teams
 * @author Mark Leung <leungas@gmail.com>
 */
@InputType()
export class TeamCreateObject {
  /**
   * @property
   * @name code
   * @description The reference code for the team
   * @type {string}
   */
  @Field(() => String, { description: 'The reference code for the team' })
  @ApiProperty({
    name: 'code',
    description: 'The reference code for the team',
    type: 'string',
    example: 'example.team.code',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  code: string;

  /**
   * @property
   * @name members
   * @description The members this team has by default
   * @type {MemberCreateObject[]}
   */
  @Field(() => [MemberCreateObject], {
    defaultValue: [],
    description: 'The members this team has by default',
  })
  @ApiProperty({
    name: 'members',
    description: 'The members this team has by default',
    type: 'array',
    items: {
      type: 'MemberCreateObject',
    },
    example: [],
    default: [],
    required: false,
  })
  @IsInstance(MemberCreateObject, { each: true })
  @IsOptional()
  members: MemberCreateObject[];

  /**
   * @property
   * @name name
   * @description The name of the team to display
   * @type {string}
   */
  @Field(() => String, { description: 'The name fo the team on display' })
  @ApiProperty({
    name: 'name',
    description: 'The name of the team to display',
    type: 'string',
    example: 'Some Display Name',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  name: string;
}
