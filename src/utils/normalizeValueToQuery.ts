import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

@Injectable()
export class NormalizeValueToQuery {
  constructor() {}

  async normalizeValue(value: string): Promise<string> {
         
    const valueWithoutSpaceInTheEdges = value.trim();
    const noAccent = this.removeAccent(valueWithoutSpaceInTheEdges);
    const noSpace = this.removeSpace(noAccent);
    const noSimpleQuote = this.removeSimpleQuote(noSpace);
    return noSimpleQuote;
  }

  private removeSimpleQuote(value: string): string {
    return value.replace(/[' ]/g, '%27');
  }
  private removeSpace(value: string): string {
    return value.replace(/ /g, '%20');
  }
  private removeAccent(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
