import { ITransactionHandler } from './handlerInterface'
import { TransactionRequest } from '../dataModels/TransactionRequest'
import { BankingTransferTransactions, TransactionType } from '../dataModels/TransactionType'
export class HdfcBankHandler implements ITransactionHandler {
  static TxnStartString = {
    UPI: 'UPI',
    EMI: 'Loan EMI',
    IMPS: 'IMPS',
    NEFT: 'NEFT',
    RTGS: 'RTGS',
    ACH: 'NACH',
    RD: 'Recurring Deposit',
    FD: 'Fixed Deposit'
  }
  TxnContainsStrings = {
    Salary: 'SALARY'
  }
  // FIXME: Need txn Detail for handling additional information on transaction
  processTransactionDescription (transactionRequest: TransactionRequest, smsSender: string) {
    const { transactionDescription, transactionType } = transactionRequest
    if (transactionType === TransactionType.UPI ) {
      if (transactionDescription.indexOf('-') > -1) {
        // Meaning update transactions such as 
        // PRASHANTH H CHANDRAM-prashanth.hc5551@ybl-BARB0AMARJY-213026885941-Payment from Phone
        // ANWESHANA EDUCATIONA-122776117000129@cnrb-CNRB0000001-134339821052-Pay to Merchant
        // XXXXXX5196-UBIN0803847-218272924789-NA.
        // XXXXXX3424-FDRL0007777-212234366862-Personal expenses
        const parts = transactionDescription.split('-')
        if (parts.length > 0){
          
          if (parts.length === 5) {
            const [recepient, recepientUpi, recepientIfsc, refNo, desc] = parts
            if (desc.toLowerCase() === 'pay to merchant') {
              transactionRequest.transactionType = TransactionType.MERCHANT.toString()
              transactionRequest.transactionReferenceId = refNo
            } else {
              transactionRequest.transactionDescription = `${recepient}-${recepientUpi}-${desc}`
            }
          } else if (parts.length === 4) {// Where transfer w/o upi handle
            const [recepient, recepientIfsc, refNo, desc] = parts
            transactionRequest.transactionDescription = `${recepient}-${desc}`
            transactionRequest.transactionReferenceId = refNo
          }
        }

      }
    } else if (transactionType === TransactionType.IMPS) {
      const parts = transactionDescription.split('-')
      if (parts.length > 0) {
        const [refNo, recepient, recepientBankShortCode, recepientAccountNumber, desc] = parts
        transactionRequest.transactionReferenceId = refNo
        transactionRequest.transactionDescription = `${recepient}-${desc}`
      }
    } else if (transactionType === TransactionType.NACH) {
      const parts = transactionDescription.split('-')
      if (parts.length > 0) {
        transactionRequest.transactionReferenceId = parts[2]
        transactionRequest.transactionDescription = parts[1]
      }
    } else if (transactionType === TransactionType.NEFT) {
      const parts = transactionDescription.split('-')

      if (parts.length > 0) {
        const [recepientIfsc, recepient, desc, refNo ] = parts
        transactionRequest.transactionReferenceId = refNo
        transactionRequest.transactionDescription = `${recepient}-${desc}`
      }
    } else if (transactionDescription.startsWith("",0))
    return transactionRequest
  }
}