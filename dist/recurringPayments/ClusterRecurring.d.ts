import { TransactionModel } from "../dataModels/TransactionModel";
import { DBOperator } from "../database/DBOperator";
export declare function createRepeatTransactionCluster(transactionModels: TransactionModel[]): any;
export declare function classifyRepeatativePayments(dbOperator: DBOperator): Promise<void>;
