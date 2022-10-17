import { DBOperator } from "../database/DBOperator";
import { SmsModel } from "../dataModels/SmsModel";
import { IAccount } from "./AccountCreator";
export declare class PPIAccount implements IAccount {
    processSms(customerId: number, smsParsedData: any, dbOperator: DBOperator, sms: SmsModel): Promise<void>;
}
