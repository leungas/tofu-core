import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';
import { models } from './models';
import { repositories } from './repositories';

@Module({
  imports: [ClientsModule, TypeOrmModule.forFeature(models)],
  providers: [...repositories],
  exports: [ClientsModule, ...repositories],
})
export class InfrastructureModule {}
