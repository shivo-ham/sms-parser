import { AccountBalanceRequest } from "../dataModels/AccountBalanceRequest";
import { AccountRequest } from "../dataModels/AccountRequest";
import { BillInfosRequest } from "../dataModels/BillInfosRequest";
import { BillRequest } from "../dataModels/BillRequest";
import { Regex } from "../dataModels/Regex"
import { SmsData } from "../dataModels/SmsData"
import { SmsModel } from "../dataModels/SmsModel"
import { TransactionRequest } from "../dataModels/TransactionRequest";
import { CreditCardRequest } from "../dataModels/CreditCardRequest";
import { BillInfosModel } from "../dataModels/BillInfosModel";
import { TransactionModel } from "../dataModels/TransactionModel";
import { RepeatativeTransactionRequest } from "../dataModels/RepeatativeTransactionRequest";
import { RepeatativeTransactionModel } from "../dataModels/RepeatativeTransactionModel";

export abstract class DBOperator {
  /**
   * Extend this class, then override constructor and implement methods accordingly
   */
  dbClient: any;
  customerId: number
  constructor(protected dbclient:any, customerId:number){
    this.dbClient = dbclient
    this.customerId = customerId
  }
  abstract fetchSmsRegex(sender: string): Promise<Regex[]>
  abstract storeSms(sms: SmsData): Promise<SmsModel>
  abstract fetchSms(smsId:any): Promise<SmsModel>
  abstract updateSmsModel(smsId:any, status:string): Promise<SmsModel>
  abstract storeTransactionData(transactionRequest:TransactionRequest,smsId:any): Promise<number>
  abstract updateTransactionModelRepaymentId(transactionModel:TransactionModel, repeatPaymentId:number):Promise<void>
  abstract fetchAccountIdByAccountTypeAndNumberAndIssuer(accountType:string,accountNumber:string, issuer:string):Promise<number | undefined>
  abstract createNewAccount(accountRequest:AccountRequest):Promise<number>
  abstract storeAccountBalance(accountBalanceRequest:AccountBalanceRequest):Promise<number>
  abstract storeCreditCard(creditCardRequest:CreditCardRequest):Promise<number>
  abstract storeBillInfos(billInfo:BillInfosRequest):Promise<number>
  abstract fetchBillByAccountId(accountId:number):Promise<number | undefined> 
  // FIXME: Change this to storeBill.
  abstract createNewBill(billRequest:BillRequest):Promise<number>
  abstract fetchLatestUnpaidBillInfoByAccountId(accountId:number):Promise<BillInfosModel | undefined>
  abstract updateBillsInfo(billInfo:BillInfosRequest):Promise<number>
  abstract fetchTransactionsByAccountId(accountId:number):Promise<number |undefined>
  abstract fetchCardsByAccountId(accountId:number):Promise<number|undefined>
  abstract fetchTransactionByAmountBetweenDates(amount:number,fromDate:Date,tillDate:Date):Promise<TransactionModel[]>
  abstract fetchTransactionsByAmountAndAccountNumberBetweenDates(amount:number,accountNumber:string,fromDate:Date,tillDate:Date):Promise<TransactionModel[]>
  abstract fetchAllCreditTransactions():Promise<TransactionModel[]>
  abstract fetchAllDebitTransactions():Promise<TransactionModel[]>
  abstract storeRepeatativePayment(repeatativePayment:RepeatativeTransactionRequest):Promise<number>
  // abstract fetchTransactions
}