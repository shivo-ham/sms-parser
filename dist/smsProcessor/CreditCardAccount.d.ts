import { DBOperator } from "../database/DBOperator";
import { IAccount } from "./AccountCreator";
export declare class CreditCardAccount implements IAccount {
    processSms(customerId: number, smsParsedData: any, dbOperator: DBOperator): Promise<void>;
    ccTransactionProcessing(customerId: number, smsParsedData: any, dbOperator: DBOperator): Promise<void>;
    ccBalanceProcessing(customerId: number, smsParsedData: any, dbOperator: DBOperator): Promise<void>;
    ccStatementProcessing(customerId: number, smsParsedData: any, dbOperator: DBOperator): Promise<void>;
}
