export class Metadata {
  static create(extra: Record<string, unknown> = {}) {
    return {
      timestamp: new Date().toISOString(),
      ...extra,
    };
  }
}