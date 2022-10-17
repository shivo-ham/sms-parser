import { ITransactionHandler } from './handlerInterface'
import { TransactionRequest } from '../dataModels/TransactionRequest'
export class SbiHandler implements ITransactionHandler {
  processTransactionDescription (transactionRequest: TransactionRequest, smsSender: string) {
    return transactionRequest
  }
}