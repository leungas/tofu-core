import { Module } from '@nestjs/common';
import { UserServiceProvider } from './user.producer';

/**
 * @module UsersModule
 * @description The module for linking AMQP to User Service
 * @author Mark Leung <leungas@gmail.com>
 */
@Module({
  providers: [UserServiceProvider],
  exports: [UserServiceProvider],
})
export class UsersModule {}
