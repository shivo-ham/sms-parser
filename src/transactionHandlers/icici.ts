import { ITransactionHandler } from './handlerInterface'
import { TransactionRequest } from '../dataModels/TransactionRequest'
import { TransactionType } from '../dataModels/TransactionType'
import { TransactionDescriptionType } from '../dataModels/TransactionDescriptionType'
export class ICICIBankHandler implements ITransactionHandler {
  static Mmt = 'MMT'
  static Salary = 'salary'
  static NEFT='neft'
  static BIL='bil'
  static ACH='ach'
  static BYCASH='by cash'
  static RTGS='rtgs'
  static NFS='nfs'
  static ATM='atm'
  static CAM='cam'
  static RCHG='rchg'
  static EMI='emi'
  static BPAY='bpay'
  static TOFD='trf to fd'
  static TORD='trf to rd'
  static IWISH='iwish'
  static CLOSURE='closure proceeds'
  // FIXME: To handle variations in #627 ( FD related), 630
  processTransactionDescription (transactionRequest: TransactionRequest, smsSender: string) {

    const { transactionDescription, transactionType, transactionReferenceId} = transactionRequest
    if(transactionType === TransactionType.TRANSFER) {
      if (transactionDescription.toLowerCase().startsWith(ICICIBankHandler.NEFT)) {
        const parts = transactionDescription.split('-')
        if (parts.length > 2) {
          transactionRequest.transactionReferenceId = parts[1]
          transactionRequest.transactionDescription = parts[2]
        }
      } else if (transactionDescription.toLowerCase().startsWith(ICICIBankHandler.ACH)) {
        const parts = transactionDescription.split('*')
        if (parts.length > 2) {
          transactionRequest.transactionReferenceId = parts[2]
          transactionRequest.transactionDescription = parts[1]
        }
      } else if (transactionReferenceId.toLowerCase().startsWith(ICICIBankHandler.NEFT) || transactionReferenceId.toLowerCase().startsWith(ICICIBankHandler.RTGS)) {
        const parts = transactionReferenceId.split('-')
        if (parts.length > 1) {
          transactionRequest.transactionReferenceId = parts[1]
          transactionRequest.transactionType = transactionReferenceId.toLowerCase().startsWith(ICICIBankHandler.NEFT) ? TransactionType.NEFT : TransactionType.RTGS
        }
      } else if (transactionReferenceId.toLowerCase().startsWith(ICICIBankHandler.ACH)) {
        const refParts = transactionReferenceId.split('*')
        const descParts = transactionDescription.split('*')
        if (refParts.length > 0 && descParts.length > 1) {
          transactionRequest.transactionDescription = `${refParts[1]}-${descParts[0]}`
          transactionRequest.transactionReferenceId = descParts[1]
        }
      } else if(transactionReferenceId.toLowerCase().startsWith(ICICIBankHandler.BIL)) {
        const parts = transactionReferenceId.split('*')
        if (parts.length >= 2) {
          transactionRequest.transactionReferenceId = parts[1]
        }
        if (parts.length >=3) {
          transactionRequest.transactionDescription = `${parts[2]} ${transactionDescription}`
        }
      } else if (transactionReferenceId.toLowerCase().startsWith(ICICIBankHandler.BYCASH)) {
        transactionRequest.transactionDescription = `${transactionRequest.transactionReferenceId}-${transactionRequest.transactionDescription}`
        transactionRequest.transactionReferenceId = ''
      } else if (transactionDescription.toLowerCase().startsWith(ICICIBankHandler.ATM) ||
      transactionDescription.toLowerCase().startsWith(ICICIBankHandler.NFS) ||
      transactionDescription.toLowerCase().startsWith(ICICIBankHandler.CAM)) {
        transactionRequest.transactionType = TransactionType.ATM_WITHDRAWAL
      } else if(transactionDescription.toLowerCase().startsWith(ICICIBankHandler.BIL)) {
        if(transactionDescription.toLowerCase().indexOf(ICICIBankHandler.EMI)) {
          transactionRequest.transactionType = TransactionType.LOAN_EMI
        } else if (transactionDescription.toLowerCase().indexOf(ICICIBankHandler.BPAY)) {
          transactionRequest.transactionType = TransactionType.BILL_PAYMENT
        } else if (transactionDescription.toLowerCase().indexOf(ICICIBankHandler.RCHG)) {
          transactionRequest.transactionType = TransactionType.RECHARGE
        }
        if (transactionDescription.toLowerCase().indexOf(ICICIBankHandler.TORD) ||
        transactionDescription.toLowerCase().indexOf(ICICIBankHandler.IWISH) 
        ) {
          transactionRequest.transactionType = TransactionType.CASA_RD
        }
        if (transactionDescription.toLowerCase().indexOf(ICICIBankHandler.TOFD)) {
          transactionRequest.transactionType = TransactionType.CASA_FD
        }
      }
    } else if (transactionType === TransactionType.CC_TRANSACTION) {
      const parts = transactionDescription.split('*')
      if (parts.length > 0) {
        transactionRequest.transactionDescription = parts[1]
      }
    }

    return transactionRequest
  }
}