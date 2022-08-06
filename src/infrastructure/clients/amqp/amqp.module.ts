import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { UsersModule } from './users/users.module';
import { AccessModule } from './access/access.module';

@Module({
  imports: [AccountsModule, UsersModule, AccessModule],
  exports: [AccountsModule, UsersModule],
})
export class AmqpModule {}
