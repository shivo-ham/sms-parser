import { TransactionRequest } from "../dataModels/TransactionRequest";
import { DBOperator } from "../database/DBOperator";
export declare function checkTransaction(transactionReq: TransactionRequest, smsFrom: string, dbOperator: DBOperator): Promise<TransactionRequest>;
