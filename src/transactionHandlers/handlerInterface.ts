
import { TransactionRequest } from "../dataModels/TransactionRequest"

export interface ITransactionHandler {
  /**
   * The method implments handling transaction description for sms'es
   *   
   * @param transaction the entire transacition object that is used to save transaction to db
   * @param smsSenderId the sender of the sms
   */
  processTransactionDescription(transactionRequest:TransactionRequest, smsSender: string): TransactionRequest
}