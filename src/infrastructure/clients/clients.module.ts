import { Module } from '@nestjs/common';
import { AmqpModule } from './amqp/amqp.module';

@Module({
  imports: [AmqpModule],
  exports: [AmqpModule],
})
export class ClientsModule {}
