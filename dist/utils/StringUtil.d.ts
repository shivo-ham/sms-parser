/**
 * Method to clean up sms body
 * @param body string raw sms body
 * @returns cleaned sms content
 */
export declare function cleanSmsContent(body: string): string;
export declare function cleanSmsAddress(address: string): string;
export declare function cleanAmount(amount: string): number;
export declare function formatAccountNumbers(accountNumber: string): {
    accountNumber: string;
    actualAccountNumber: any;
};
export declare function stringSimilarityScore(s1: string, s2: string[]): {
    rating: number;
    index: number;
};
export declare function enumFromStringValue<T>(enm: {
    [s: string]: T;
}, value: string): T | undefined;
