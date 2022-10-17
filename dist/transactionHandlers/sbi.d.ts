import { ITransactionHandler } from './handlerInterface';
import { TransactionRequest } from '../dataModels/TransactionRequest';
export declare class SbiHandler implements ITransactionHandler {
    processTransactionDescription(transactionRequest: TransactionRequest, smsSender: string): TransactionRequest;
}
