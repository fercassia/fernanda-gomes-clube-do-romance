export class MaskSensitiveFields {
  private static SENSITIVE_FIELDS = ['password', 'token'];
  private static MASK = '****';

  static maskSensitiveFields<T extends Record<string, unknown> | unknown[]>(data: T): T {
    return this.processData(data, new WeakSet()) as T;
  }

  private static processData(data: unknown, seen: WeakSet<object>): unknown {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) return this.processArray(data, seen);
    return this.processObject(data as Record<string, unknown>, seen);
  }

  private static processObject(obj: Record<string, unknown>, seen: WeakSet<object>): Record<string, unknown> {
    if (seen.has(obj)) return obj;
    seen.add(obj);

    const newObj: Record<string, unknown> = { ...obj };

    for (const key of Object.keys(newObj)) {
      const value = newObj[key];

      if (this.identifySensitiveField(key)) {
        newObj[key] = this.MASK;
        continue;
      }
      
      if (value === null || value === undefined) {
        continue;
      }

      newObj[key] = this.processData(value, seen);
    }

    return newObj;
  }

  private static processArray(array: unknown[], seen: WeakSet<object>): unknown[] {
    return array.map(item => this.processData(item, seen));
  }

  private static identifySensitiveField(key: string): boolean {
    return this.SENSITIVE_FIELDS.some(sensitiveField => key.toLowerCase().includes(sensitiveField));
  }
}