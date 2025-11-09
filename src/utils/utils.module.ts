import { Module } from '@nestjs/common';
import { PasswordHasherd } from './passwordHashed.js';

@Module({
  providers: [PasswordHasherd],
  exports: [PasswordHasherd],
})
export class UtilsModule {}