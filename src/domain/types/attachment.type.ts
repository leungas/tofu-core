import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsIn, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * @class
 * @name Attachment
 * @description The structure for file attachments
 * @author Mark Leung <leungas@gmail.cmm>
 */
@ObjectType()
export class Attachment {
  /**
   * @property
   * @name asset
   * @description The asset reference path (URL or assetName)
   * @type {string}
   */
  @Field(() => String, {
    description: 'The asset reference path (URL or assetName)',
  })
  @ApiProperty({
    name: 'asset',
    description: 'The asset reference path (URL or assetName)',
    type: 'string',
    example: 'http://some.where/stored/this-file',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  asset: string;

  /**
   * @property
   * @name contentType
   * @description The MIME content type of the file
   * @type {string}
   */
  @Field(() => String, { description: 'The MIME content type of the file' })
  @ApiProperty({
    name: 'contentType',
    description: 'The MIME content type of the file',
    type: 'string',
    example: 'application/json',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  contentType: string;

  /**
   * @property
   * @name original
   * @description The original file name for the attachment
   * @type {string}
   */
  @Field(() => String, {
    description: 'The original file name for the attachment',
  })
  @ApiProperty({
    name: 'orignal',
    description: 'The original file name for the attachment',
    type: 'string',
    example: 'http://some.where/stored/this-file',
    required: true,
  })
  @IsNotEmpty()
  @IsDefined()
  original: string;

  /**
   * @property
   * @name resource
   * @description The resource (storage account) for the attachment
   * @type {string}
   */
  @Field(() => String, {
    description: 'The resource (storage account) for the attachment',
  })
  @ApiProperty({
    name: 'resource',
    description: 'The resource (storage account) for the attachment',
    type: 'string',
    example: 'Key Resource',
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  resource?: string;

  /**
   * @property
   * @name type
   * @description The attachment type (either URL or Asset)
   * @type {string}
   */
  @Field(() => String, {
    description: 'The attachment type (either URL or Asset)',
  })
  @ApiProperty({
    name: 'type',
    description: 'The attachment type (either URL or Asset)',
    type: 'string',
    default: 'url',
    example: 'url',
    required: true,
  })
  @IsIn(['asset', 'url'])
  @IsDefined()
  type: 'url' | 'asset' = 'url';
}
