
export class RandomCodesActivation {
  private static readonly codeLengthMaximum: number = 1000000;

  static generate(): Promise<string> {
    const randomIndex = Math.floor(Math.random() * this.codeLengthMaximum).toString().padStart(6, '0');
    return Promise.resolve(randomIndex);
  }
}