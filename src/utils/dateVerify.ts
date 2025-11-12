export class DateVerify {
  private static readonly MS_PER_DAY = 24 * 60 * 60 * 1000;
  static verify(actualDate: Date, dateToVerify: Date, timeFrameToVerify: number ): boolean {
    if (!dateToVerify || !timeFrameToVerify) return false;
    if(!(( actualDate.getTime() - dateToVerify.getTime()) >= timeFrameToVerify * this.MS_PER_DAY)) return false
    return true
  }
}