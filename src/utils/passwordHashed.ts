import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

@Injectable()
export class PasswordHasherd {
  private readonly cost = Number(process.env.HASH_COST ?? 12);

  constructor() {}

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.cost);
  }

  verify(plain: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plain, digest);
  }
  encriptPassword(plain: string): Promise<string> {
    return Promise.resolve(createHash('sha256').update(plain).digest('hex'));
  }
}
