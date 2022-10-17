import * as dayjs from 'dayjs';
export declare function parseDateTime(dateFormats: string, dateString: string, smsSentAt: string): Date;
export declare function strictDateParsing(dateString: string, format: string, smsDate: string): Date;
export declare function getTimeWithOffsetInMinutes(baseTime: Date, offset: number): Promise<Date>;
export declare function isHourMinuteSecondPresent(date: dayjs.Dayjs): boolean;
export declare function findClosestDate(arr: Date[], target: Date): Promise<number>;
