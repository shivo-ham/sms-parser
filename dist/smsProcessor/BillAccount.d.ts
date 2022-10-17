import { DBOperator } from "../database/DBOperator";
import { IAccount } from "./AccountCreator";
export declare class BillAccount implements IAccount {
    processSms(customerId: number, smsParsedData: any, dbOperator: DBOperator): Promise<void>;
    billStatementGeneration(customerId: number, smsParsedData: any, dbOperator: DBOperator): Promise<void>;
    billConfirmation(customerId: number, smsParsed: any, dbOperator: DBOperator): Promise<void>;
}
