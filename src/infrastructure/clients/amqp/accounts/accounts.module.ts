import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountServiceConsumer } from './account.consumer';
import { AccountServiceProducer } from './account.producer';

/**
 * @module AccountsModule
 * @description the wiring for account service integration
 * @author Mark Leung <leungas@gmail.com>
 */
@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const exchange = config.get('exchange');
        const name = config.get('exchange.exchanges.accounts.name');
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
  providers: [AccountServiceProducer, AccountServiceConsumer],
  exports: [AccountServiceProducer],
})
export class AccountsModule {}
