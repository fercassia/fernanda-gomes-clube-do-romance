import { Module } from '@nestjs/common';
import { PasswordHasherd } from './passwordHashed.js';
import { NormalizeValueToQuery } from './normalizeValueToQuery.js';

@Module({
  providers: [PasswordHasherd, NormalizeValueToQuery],
  exports: [PasswordHasherd, NormalizeValueToQuery],
})
export class UtilsModule {}
