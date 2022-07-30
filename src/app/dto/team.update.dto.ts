import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

/**
 * @class
 * @name TeamUpdateObject
 * @description The object to use during update
 * @author Mark Leung <leungas@gmail.com>
 */
@InputType()
export class TeamUpdateObject {
  /**
   * @property
   * @name name
   * @description The name of the team to change to
   * @type {string}
   */
  @Field(() => String, { description: 'The name of the team to change to' })
  @ApiProperty({
    name: 'name',
    description: 'The name of the team to change to',
    type: 'string',
    example: 'Some Team Name',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  name: string;
}
