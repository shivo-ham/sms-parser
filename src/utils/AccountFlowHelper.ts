import { DBOperator } from "../database/DBOperator"
import { AccountRequest } from "../dataModels/AccountRequest"
import { BillInfosModel } from "../dataModels/BillInfosModel"
import { BillInfosRequest } from "../dataModels/BillInfosRequest"
import { BillRequest } from "../dataModels/BillRequest"
import { CreditCardRequest } from "../dataModels/CreditCardRequest"
import { TransactionRequest } from "../dataModels/TransactionRequest"

// FIXME: Same as below. Duplicate
export async function createOrUpdateBillInfos(billInfoReq: BillInfosRequest, dbOperator: DBOperator): Promise<number> {
  //TODO - search by due date and generation date (for statement)
  // FOr repayment - as below
  let billInfo: BillInfosModel = await dbOperator.fetchLatestUnpaidBillInfoByAccountId(billInfoReq.accountId)
  let billInfoId: any
  if (billInfo) {
    billInfoReq.id=billInfo.id
    billInfoId = await dbOperator.updateBillsInfo(billInfoReq)
  } else {
    billInfoId = await dbOperator.storeBillInfos(billInfoReq)
  }
  return billInfoId
}
// FIXME: this should be storeBillInfo to be implemented in the DbOperator - takes care of create / update
export async function updateBillInfos(billInfoReq: BillInfosRequest, dbOperator: DBOperator): Promise<number> {
  console.log("Inside Update Bill Infos")
  //TODO - 
  let billInfo: BillInfosModel = await dbOperator.fetchLatestUnpaidBillInfoByAccountId(billInfoReq.accountId)
  //If unpaid bill info there, there will be bill_amount key, then comapre tranxn_amount(amount paid)
  //and if they are same it is PAID, if less the PARTIAL_PAID and update status here itself
  let billInfoId: number
  if (billInfo) {
    billInfoReq.id=billInfo.id
    billInfoId = await dbOperator.updateBillsInfo(billInfoReq)
  } else {
    billInfoId = await dbOperator.storeBillInfos(billInfoReq)
  }
  console.log("Returning Bill Infos ID :"+ billInfoId)
  return billInfoId
}
// FIXME: This logic incorrect and not needed. Need to have a storeBill ( like storeCreditCard )
export async function createOrUpdateBills(billRequest: BillRequest, dbOperator: DBOperator): Promise<void> {
  let billId = await dbOperator.fetchBillByAccountId(billRequest.accountId)
  if (typeof billId === 'undefined') {
    console.log("Creating Bill entity")
    billId = await dbOperator.createNewBill(billRequest)
  }
}

export async function checkAccount(accountRequest: AccountRequest, dbOperator: DBOperator): Promise<number> {
  let accountId = await dbOperator.fetchAccountIdByAccountTypeAndNumberAndIssuer(accountRequest.accountType, accountRequest.accountNumber,accountRequest.smsFrom)
  console.log("Account ID in check account : "+JSON.stringify(accountId))
  if (typeof accountId === 'undefined') {
    console.log("Creating Account entity")
    accountId = await dbOperator.createNewAccount(accountRequest)
  }
  return new Promise((resolve) => { resolve(accountId) })
}
// FIXME: This logic not needed
export async function createOrUpdateCards(creditCardReq:CreditCardRequest, dbOperator:DBOperator): Promise<void> {
  console.log("Inside create or update cards")
  let cardId = await dbOperator.fetchCardsByAccountId(creditCardReq.accountId)
  if (typeof cardId === 'undefined') {
    console.log("Creating card entity")
    cardId = await dbOperator.storeCreditCard(creditCardReq)
  }
  console.log("card ID is :"+ cardId)
}
// FIXME: This logic Not needed
export async function createBillTransactionForCC(smsId:number,transactionReq:TransactionRequest,dbOperator:DBOperator):Promise<void>{
  console.log("Inside create Bill Transaction for cc")
  let transactionId = await dbOperator.fetchTransactionsByAccountId(transactionReq.accountId)
  console.log("Transaction ID is :"+ transactionId)
  if (typeof transactionId === 'undefined') {
    console.log("Creating card entity")
    transactionId = await dbOperator.storeTransactionData(transactionReq,smsId)
  }
  console.log("Transaction ID is "+ transactionId)
}

