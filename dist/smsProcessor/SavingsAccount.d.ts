import { DBOperator } from "../database/DBOperator";
import { IAccount } from "./AccountCreator";
export declare class SavingsAccount implements IAccount {
    /**
     * Implementation of savings parseSms method based on transaction request, account request
     * and accountBalance request
     *
     */
    processSms(customerId: number, smsParsedData: any, dbOperator: DBOperator): Promise<void>;
}
