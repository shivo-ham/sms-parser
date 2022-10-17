import { DBOperator } from "../database/DBOperator"
import { AccountBalanceRequest } from "../dataModels/AccountBalanceRequest"
import { AccountRequest } from "../dataModels/AccountRequest"
import { TransactionRequest } from "../dataModels/TransactionRequest"
import { IAccount } from "./AccountCreator"
import { MessageType } from "../dataModels/MessageType"
import { TransactionTimeSourceType } from "../dataModels/TransactionTimeSourceType"
import { checkTransaction } from "../utils/TransactionUtil"
import { checkAccount } from "../utils/AccountFlowHelper"


export class SavingsAccount implements IAccount {
  /**
   * Implementation of savings parseSms method based on transaction request, account request
   * and accountBalance request
   * 
   */
  async processSms(customerId: number, smsParsedData: any, dbOperator: DBOperator): Promise<void> {
    
    let transactionRequest: TransactionRequest = {
      transactionAt: smsParsedData['transaction_date'],
      transactionType: smsParsedData['transaction_type'],
      transactionDescription: smsParsedData['transaction_description'],
      transactionDescriptionRaw: smsParsedData['transaction_description'],
      amount: 0,
      accountId: null,
      balanceType: null,
      generationType: null,
      accountNumber: smsParsedData['account_number'],
      accountType: smsParsedData['account_type'],
      category: null,
      categoryType: null,
      transactionReferenceId: smsParsedData['transaction_reference_no'],
      messageType: smsParsedData['message_type'],
      duplicateConfidence:null,
      duplicateId:null,
      matchingId:null,
      matchingConfidence:null,
      // FIXME: Default to this value. Will change after parser implementation
      transactionTimeSource: TransactionTimeSourceType.FROM_SMS.valueOf(),
      accountBalance: smsParsedData['available_balance']
    }
    if (smsParsedData['message_type'] === MessageType.DEBIT) {
      transactionRequest.amount = -1 * Number(smsParsedData['transaction_amount'])
    } else {
      transactionRequest.amount = Number(smsParsedData['transaction_amount'])
    }
    let accountRequest: AccountRequest = {
      customerId:customerId,
      accountType: smsParsedData['account_type'],
      smsFrom: smsParsedData["sms_from"],
      smsId: smsParsedData["sms_id"],
      accountNumber: smsParsedData['account_number'],
      actualAccountNumber: smsParsedData['actual_account_number'],
      upiId: smsParsedData['upi_number']
    }
    accountRequest.phoneNumber = 0
    // accountRequest.upiId = smsParsedData['upi_number']
    let accountId:number = await checkAccount(accountRequest,dbOperator)
    let accountBalanceRequest: AccountBalanceRequest = {
      accountId: accountId,
      balanceAt: smsParsedData['transaction_date'],
      balanceAmount: smsParsedData['available_balance'],
      smsId: smsParsedData["sms_id"]
    }
    transactionRequest.accountId = accountId
    transactionRequest = await checkTransaction(transactionRequest,smsParsedData["sms_from"],dbOperator)
    await dbOperator.storeTransactionData(transactionRequest, smsParsedData["sms_id"])
    await dbOperator.storeAccountBalance(accountBalanceRequest)
  }
}