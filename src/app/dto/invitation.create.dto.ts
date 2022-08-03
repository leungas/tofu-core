import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';

/**
 * @class
 * @name InvitationCreateObject
 * @description The create structure for the invitation
 * @author Mark Leung <leungas@gmail.com>
 */
@InputType()
export class InvitationCreateObject {
  /**
   * @property
   * @name email
   * @description The email to use in invite
   * @type {string}
   */
  @Field(() => String, { description: 'The email to use in invite' })
  @ApiProperty({
    name: 'email',
    description: 'The email to use in invitation',
    type: 'string',
    example: 'john.smith@costono.com',
    required: true,
  })
  @IsEmail()
  @IsDefined()
  email: string;
}
