import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { DomainModule } from '../domain/domain.module';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/infrastructure/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

/**
 * @module AppModule
 * @description the module for application scaffold
 * @author Mark Leung <leungas@gmail.com>
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DomainModule,
    EventEmitterModule.forRoot(),
    InfrastructureModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const result = { ...config.get('datasource') };
        return result;
      },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
