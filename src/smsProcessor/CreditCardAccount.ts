import { DBOperator } from "../database/DBOperator";
import { AccountRequest } from "../dataModels/AccountRequest";
import { BillInfosRequest } from "../dataModels/BillInfosRequest";
import { BillRequest } from "../dataModels/BillRequest";
import { IAccount } from "./AccountCreator";
import { CreditCardRequest } from "../dataModels/CreditCardRequest";
import { TransactionRequest } from "../dataModels/TransactionRequest";
import { checkAccount, createOrUpdateBillInfos, createOrUpdateBills, updateBillInfos } from "../utils/AccountFlowHelper";
import { checkTransaction } from "../utils/TransactionUtil";

export class CreditCardAccount implements IAccount {
  // FIXME: Need to handle CC_STATEMENT, REPAYMENT, REMINDER
  async processSms(customerId: number, smsParsedData: any, dbOperator: DBOperator): Promise<void> {
    let transactionType: string = smsParsedData["transaction_type"]
    switch (transactionType) {
      case "CC_BALANCE":
        await this.ccBalanceProcessing(customerId,smsParsedData, dbOperator)
        break
      case "CC_TRANSACTION":
        await this.ccTransactionProcessing(customerId,smsParsedData, dbOperator)
        break;
      case "CC_STATEMENT":
        await this.ccStatementProcessing(customerId, smsParsedData, dbOperator)
        break;
    }
  }

  async ccTransactionProcessing(customerId:number,smsParsedData: any, dbOperator: DBOperator) {
    let accountRequest: AccountRequest = {
      customerId:customerId,
      accountType: smsParsedData["account_type"],
      smsFrom: smsParsedData["sms_from"],
      smsId: smsParsedData["sms_id"],
      accountNumber: smsParsedData["account_number"],
      actualAccountNumber: smsParsedData["actual_account_number"],
      upiId: null
    }
    accountRequest.phoneNumber = 0
    accountRequest.upiId = smsParsedData['upi_number']
    let accountId = await checkAccount(accountRequest, dbOperator);
    let creditCardReq: CreditCardRequest = {
      smsId: smsParsedData["sms_id"],
      accountId: accountId,
      cardType: "CREDITCARD",
      brand: smsParsedData["cc_brand_name"],
      cardNetwork: null,
      totalCreditLine: smsParsedData["cc_available_limit"],
      availableCreditLine: smsParsedData["cc_outstanding_balance"],
      totalCreditAt: smsParsedData["transaction_date"],
      availableCreditAt: smsParsedData["transaction_date"]
    }

    let billInfoReq: BillInfosRequest
    let messageType: string = smsParsedData["message_type"]
    let transactionReq: TransactionRequest = {
      accountId: accountId,
      accountNumber: smsParsedData["account_number"],
      accountType: smsParsedData["account_type"],
      accountBalance: smsParsedData["cc_outstanding_balance"],
      balanceType: null,
      transactionDescription: smsParsedData["transaction_description"],
      category: "",
      categoryType: "",
      transactionReferenceId: smsParsedData["transaction_reference_no"],
      transactionAt: smsParsedData['transaction_date'],
      transactionType: smsParsedData["transaction_type"],
      amount: smsParsedData["transaction_amount"],
      messageType: messageType,
      transactionTimeSource: "",
      generationType: "",
      billInfoId: null,
      matchingId:null,
      matchingConfidence:null,
      duplicateId:null,
      duplicateConfidence:null
    }
    if (messageType === 'DEBIT') {
      transactionReq.amount = -1 * transactionReq.amount
    }
    if (messageType === 'CC_REPAYMENT') {
      transactionReq.transactionDescription = 'Credit Card Payment'
      billInfoReq = {
        id: 0,
        paymentAt: smsParsedData['transaction_date'],
        paymentStatus: 'PAID',
        paidAmount: smsParsedData["transaction_amount"],
        //This is for statement generation
        billedAmount: smsParsedData["bill_amount"],
        //This is for statement generation not here
        minimumAmount: 0,
        smsId: smsParsedData["sms_id"],
        accountId: accountId,
        //This is for statement generation for both keys
        generationAt: smsParsedData["bill_generation_date"],
        dueAt: smsParsedData["cc_pmt_due_date"]
      }
      // billInfoReq.paymentAt = smsParsedData['transaction_date']
      let billInfoId = await updateBillInfos(billInfoReq, dbOperator)
      if (billInfoId) {
        transactionReq.billInfoId = billInfoId
      }
      transactionReq.billInfoId = billInfoId
      transactionReq = await checkTransaction(transactionReq,smsParsedData["sms_from"],dbOperator)
    }
    await dbOperator.storeCreditCard(creditCardReq)
    await dbOperator.storeTransactionData(transactionReq, smsParsedData['sms_id'])

  }

  async ccBalanceProcessing(customerId:number, smsParsedData: any, dbOperator: DBOperator) {
    let accountRequest: AccountRequest = {
      customerId: customerId,
      actualAccountNumber: smsParsedData["actualAccountNumber"],
      accountType: smsParsedData["account_type"],
      smsFrom: smsParsedData["sms_from"],
      smsId: smsParsedData["sms_id"],
      accountNumber: smsParsedData["account_number"],
      upiId: null
    }
    accountRequest.phoneNumber = 0
    accountRequest.upiId = smsParsedData['upi_number']
    let accountId = await checkAccount(accountRequest, dbOperator);
    let creditCardReq: CreditCardRequest = {
      smsId: smsParsedData["sms_id"],
      accountId: accountId,
      cardType: "CREDITCARD",
      brand: smsParsedData["cc_brand_name"],
      cardNetwork: null,
      totalCreditLine: smsParsedData["cc_available_limit"],
      availableCreditLine: smsParsedData["cc_outstanding_balance"],
      totalCreditAt: smsParsedData['transaction_date'],
      availableCreditAt: smsParsedData['transaction_date']
    }
    await dbOperator.storeCreditCard(creditCardReq)
  }

  async ccStatementProcessing(customerId:number,smsParsedData: any, dbOperator: DBOperator) {
    let generationAt = smsParsedData["bill_generation_date"]
    let dueAt = smsParsedData["cc_pmt_due_date"]
    let accountRequest: AccountRequest = {
      accountType: smsParsedData["account_type"],
      smsFrom: smsParsedData["sms_from"],
      smsId: smsParsedData["sms_id"],
      accountNumber: smsParsedData["account_number"],
      actualAccountNumber: smsParsedData["actual_account_number"],
      customerId: customerId,
      upiId: null
    }
    accountRequest.phoneNumber = 0
    accountRequest.upiId = smsParsedData['upi_number']
    let accountId = await checkAccount(accountRequest, dbOperator);
    let creditCardReq: CreditCardRequest = {
      smsId: smsParsedData["sms_id"],
      accountId: accountId,
      cardType: "CREDITCARD",
      brand: smsParsedData["cc_brand_name"],
      cardNetwork: null,
      totalCreditLine: smsParsedData["cc_available_limit"],
      availableCreditLine: smsParsedData["cc_outstanding_balance"],
      totalCreditAt: smsParsedData["transaction_date"],
      availableCreditAt: smsParsedData["transaction_date"]
    }

    //Delete account balance
    await dbOperator.storeCreditCard(creditCardReq)
    let billRequest: BillRequest = {
      id: 0,
      accountId: accountId,
      recurrenceCycle: 1,
      generationDate: (generationAt === null) ? null : generationAt.getDate(),
      dueDate: (dueAt === null) ? null : dueAt.getDate(),
      smsId: smsParsedData["sms_id"]
    }
    await createOrUpdateBills(billRequest, dbOperator)
    let billPaymentStatus: string = 'UNPAID'

    //TODO - Payment related data  not required(paymentAt, paidAmount)
    let billInfoReq: BillInfosRequest = {
      id: 0,
      paymentStatus: billPaymentStatus,
      billedAmount: smsParsedData["cc_total_amt_due"],
      minimumAmount: smsParsedData["cc_min_amt_due"],
      smsId: smsParsedData["sms_id"],
      accountId: accountId,
      generationAt: smsParsedData["bill_generation_date"],
      dueAt: smsParsedData["cc_pmt_due_date"] || smsParsedData["bill_due_date"]
    }
    if (billInfoReq.dueAt === null) {
      if (smsParsedData["transaction_type"] = 'BILL_IMMEDIATE') {
        //TODO - set data to previous day
      } else if (smsParsedData["transaction_type"] = 'BILL_DUE_TODAY') {
        //TODO - set data as current date
      }
    }
    await createOrUpdateBillInfos(billInfoReq, dbOperator)
  }
}