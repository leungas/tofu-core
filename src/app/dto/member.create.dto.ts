import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { v4 as uuid } from 'uuid';

/**
 * @class
 * @name MemberCreateObject
 * @description The data structure for creating new member
 * @author Mark Leung <leungas@gmail.com>
 */
@InputType()
export class MemberCreateObject {
  /**
   * @property
   * @name user
   * @description The user id of the member
   * @type {string}
   */
  @Field(() => String, { description: 'The user id of the member' })
  @ApiProperty({
    name: 'user',
    description: 'The user id of the member',
    type: 'string',
    example: uuid(),
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  user: string;
}
