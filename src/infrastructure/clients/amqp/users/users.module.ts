import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserServiceProvider } from './user.producer';

/**
 * @module UsersModule
 * @description The module for linking AMQP to User Service
 * @author Mark Leung <leungas@gmail.com>
 */
@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const exchange = config.get('exchange');
        const name = config.get('exchange.exchanges.users.name');
        return {
          exchanges: [
            {
              name: name,
              type: 'topic',
            },
          ],
          uri: `amqp://${exchange.user}:${exchange.password}@${exchange.host}:${exchange.port}`,
          connectionInitOptions: { wait: false },
        };
      },
    }),
  ],
  providers: [UserServiceProvider],
  exports: [UserServiceProvider],
})
export class UsersModule {}
