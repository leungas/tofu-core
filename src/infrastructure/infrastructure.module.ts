import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ClientsModule } from './clients/clients.module'; # passivated for demo
import { models } from './models';
import { repositories } from './repositories';

@Module({
  imports: [
    // ClientsModule, #passivated for demo
    TypeOrmModule.forFeature(models)
  ],
  providers: [...repositories],
  exports: [
    // ClientsModule, # passivated for demo
    ...repositories
  ],
})
export class InfrastructureModule {}
