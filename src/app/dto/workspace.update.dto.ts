import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

/**
 * @class
 * @name WorkspaceUpdateObject
 * @description The data structure allowed during update
 * @author Mark Leung <leungas@gmail.com>
 */
@InputType()
export class WorkspaceUpdateObject {
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
    example: 'Some workspace name',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  name: string;
}
