export class Sanitize {
  static readonly SensitiveFields = ['password', 'token'];

  static sanitizeValue<T>(object: T): T {
    if (!object || typeof object !== 'object') return object;

    if (Array.isArray(object)) {
      return object.map((item) => this.sanitizeValue(item)) as T;
    }

    const resultObject: T & Object = { ...object };

    Object.keys(resultObject).forEach((key) => {
      const lowered = key.toLowerCase();
      if (this.SensitiveFields.some((f) => lowered.includes(f))) {
        resultObject[key] = '****';
      } else if (typeof resultObject[key] === 'object') {
        resultObject[key] = this.sanitizeValue(resultObject[key]);
      }
    });

    return resultObject as T;
  }
}