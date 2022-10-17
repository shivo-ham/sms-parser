import { DBOperator } from "../database/DBOperator";
import { AccountRequest } from "../dataModels/AccountRequest";
import { BillInfosRequest } from "../dataModels/BillInfosRequest";
import { BillRequest } from "../dataModels/BillRequest";
import { TransactionRequest } from "../dataModels/TransactionRequest";
import { checkAccount, createOrUpdateBillInfos, createOrUpdateBills, updateBillInfos } from "../utils/AccountFlowHelper";
import { checkTransaction } from "../utils/TransactionUtil";
import { IAccount } from "./AccountCreator";

export class BillAccount implements IAccount {
  // FIXME: Bill transaction will result in duplicate entries. Need to handle all cases for bills. 
  async processSms(customerId: number, smsParsedData: any, dbOperator: DBOperator): Promise<void> {
    let transactionType: string = smsParsedData["transaction_type"]
    switch (transactionType) {
      case "BILL_GENERATION":
        await this.billStatementGeneration(customerId,smsParsedData, dbOperator)
        break
      case "BILL_CONFIRMATION":
        await this.billConfirmation(customerId,smsParsedData, dbOperator)
        break;
      case "BILL_IMMEDIATE":
        await this.billStatementGeneration(customerId,smsParsedData, dbOperator)
        break;
      case "BILL_DUE_DATE":
        await this.billStatementGeneration(customerId,smsParsedData, dbOperator)
        break;
    }
  }

  async billStatementGeneration(customerId:number,smsParsedData: any, dbOperator: DBOperator) {
    let generationAt = smsParsedData["bill_generation_date"]
    let dueAt = smsParsedData["bill_due_date"]
    let accountRequest: AccountRequest = {
      accountType: smsParsedData["account_type"],
      smsFrom: smsParsedData["sms_from"],
      smsId: smsParsedData["sms_id"],
      accountNumber: smsParsedData["account_number"],
      actualAccountNumber: smsParsedData["actual_account_number"],
      customerId: customerId,
      upiId:null
    }

    let accountId = await checkAccount(accountRequest, dbOperator)

    let billRequest: BillRequest = {
      id: 0,
      accountId: accountId,
      recurrenceCycle: 1,
      generationDate: (generationAt === null)?null:generationAt.getDate(),
      dueDate: (dueAt === null)?null:dueAt.getDate(),
      smsId: smsParsedData["sms_id"]
    }
    await createOrUpdateBills(billRequest, dbOperator)
    let billPaymentStatus: string = 'UNPAID'

  
    let billInfoReq: BillInfosRequest = {
      id: 0,
      paidAmount :null,
      paymentAt: null,
      paymentStatus: billPaymentStatus,
      billedAmount: smsParsedData["bill_amount"],
      minimumAmount: 0,
      smsId: smsParsedData["sms_id"],
      accountId: accountId,
      generationAt: generationAt,
      dueAt: dueAt
    }
    if (billInfoReq.dueAt === null) {
      if (smsParsedData["transaction_type"] = 'BILL_IMMEDIATE') {
        //TODO - set date to previous day
      } else if (smsParsedData["transaction_type"] = 'BILL_DUE_TODAY') {
        //TODO - set date as current date
      }
    }
    await createOrUpdateBillInfos(billInfoReq, dbOperator)
  }

  async billConfirmation(customerId:number, smsParsed: any, dbOperator: DBOperator) {
    let generationAt = smsParsed["bill_generation_date"]
    let dueAt = smsParsed["bill_due_date"]

    let accountRequest: AccountRequest = {
      customerId:customerId,
      accountType: smsParsed["account_type"],
      smsFrom: smsParsed["sms_from"],
      smsId: smsParsed["sms_id"],
      accountNumber: smsParsed["account_number"],
      actualAccountNumber: smsParsed["actual_account_number"],
      upiId: null
    }
    let accountId = await checkAccount(accountRequest, dbOperator);


    let billRequest: BillRequest = {
      id: 0,
      accountId: accountId,
      recurrenceCycle: 1,
      generationDate: (generationAt === null)?null:generationAt.getDate(),
      dueDate: (dueAt === null)?null:dueAt.getDate(),
      smsId: smsParsed["sms_id"]
    }

    await createOrUpdateBills(billRequest, dbOperator)

    let billPaymentStatus: string = "PAID"
    if (smsParsed["message_type"] === "BILL_PAYMENT") {
        billPaymentStatus = "PAID"
    }

    let billInfoReq: BillInfosRequest = {
      id: 0,
      paymentAt: smsParsed['transaction_date'],
      paymentStatus: billPaymentStatus,
      paidAmount: smsParsed["transaction_amount"],
      billedAmount: null,
      minimumAmount: 0,
      smsId: smsParsed["sms_id"],
      accountId: accountId,
      generationAt:null,
      dueAt:null
    }

    //TODO - Rather call Update Bill infos as generation_at, due date is not there
    let billInfoId = await updateBillInfos(billInfoReq, dbOperator)

    let transactionReq: TransactionRequest = {
      accountId: accountId,
      accountNumber: smsParsed["account_number"],
      accountType: smsParsed["account_type"],
      accountBalance: null,
      balanceType: null,
      transactionDescription: "",
      category: "",
      categoryType: "",
      transactionReferenceId: "",
      transactionAt: smsParsed["transaction_date"],
      transactionType: smsParsed["transaction_type"],
      amount: smsParsed["transaction_amount"],
      messageType: smsParsed["message_type"],
      transactionTimeSource: "",
      generationType: "",
      billInfoId: billInfoId,
      matchingId:null,
      matchingConfidence:null,
      duplicateId:null,
      duplicateConfidence:null
    }
    //check matching
    transactionReq = await checkTransaction(transactionReq,smsParsed["sms_from"],dbOperator)
    await dbOperator.storeTransactionData(transactionReq, Number(smsParsed["sms_id"]))
  }

}
