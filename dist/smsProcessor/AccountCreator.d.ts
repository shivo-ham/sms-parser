import { DBOperator } from "../database/DBOperator";
import { SmsModel } from "../dataModels/SmsModel";
export interface IAccount {
    /**
     * The method implments how the parsed SMS needs to be processed and stored in tables
     *
     * @param customerId integeral customer id
     * @param smsParsedData parsed data object returned after parsing sms content against regex pattern
     * @param dbOperator DBoperator instance for client
     * @param smsId integral sms id
     */
    processSms(customerId: number, smsParsedData: any, dbOperator: DBOperator, sms: SmsModel): Promise<void>;
}
export declare class AccountCreator {
    /**
     * This method is a factory method used to create Accounts based on types
     * @param accountType AccountType enum value
     * @returns instance of Account created by factory
     */
    static createAccount(accountType: string): IAccount;
}
