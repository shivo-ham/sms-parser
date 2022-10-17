import { TransactionModel } from "../dataModels/TransactionModel";
import { TransactionRequest } from "../dataModels/TransactionRequest";
import { enumFromStringValue, stringSimilarityScore } from "./StringUtil";
import { Constants } from '../configs/Constants'
import { TransactionType } from "../dataModels/TransactionType";
import { DBOperator } from "../database/DBOperator";
import { findClosestDate, getTimeWithOffsetInMinutes } from "./DateUtil";

export async function checkTransaction(transactionReq: TransactionRequest,smsFrom:string,dbOperator:DBOperator): Promise<TransactionRequest> {
  let duplicateWindow = await getTimeWithOffsetInMinutes(transactionReq.transactionAt,Constants.DUPLICATE_TRANSACTION_BUFFER_TIME)
  let transactionList = await dbOperator.fetchTransactionsByAmountAndAccountNumberBetweenDates(transactionReq.amount,transactionReq.accountNumber,duplicateWindow,transactionReq.transactionAt)

  if(transactionList.length > 0){
    transactionReq = await processDuplicateTransaction(transactionReq, transactionList)
  }
  let matchingWindow = await getTimeWithOffsetInMinutes(transactionReq.transactionAt,Constants.MATCHING_TRANSACTION_BUFFER_TIME)
  let matchingTransList = await dbOperator.fetchTransactionByAmountBetweenDates(-1*transactionReq.amount,matchingWindow,transactionReq.transactionAt)
  if(transactionReq.transactionType === TransactionType.CC_BILL_PAYMENT || 
    transactionReq.transactionType === TransactionType.BILL_CONFIRMATION){
    transactionReq = await billPaymentsException(transactionReq,matchingTransList)
  }else{
    matchingTransList = matchingTransList.filter(item => !(item.accountId === transactionReq.accountId))
    transactionReq = await processMatchingTransaction(transactionReq, matchingTransList)
  }
  return transactionReq
}

async function processDuplicateTransaction(transactionReq: TransactionRequest, transactionList: TransactionModel[]) {
  if (transactionList.length == 0) {
    console.log("No duplicate transaction found")
    return transactionReq
  }
  else {
    let estimatedDupTransaction: TransactionModel = transactionList[0]
    transactionReq.duplicateId = estimatedDupTransaction.id
    transactionReq.duplicateConfidence = Constants.DEAFAULT_DUPLICATE_TRANS_DESCRIPTION_CONFIDENCE
  }
  let currTransactionRefNum = transactionReq.transactionReferenceId
  if (currTransactionRefNum) {
    let transRefList: string[] = transactionList.map((trxn) => { return trxn.transactionReferenceId })
    const { index, rating } = stringSimilarityScore(currTransactionRefNum, transRefList)
    console.log("Index and ratings are : "+ index +", "+rating)
    if (index >= 0 && rating >= Constants.CUTOFF_DUPLICATE_TRANS_DESCRIPTION_CONFIDENCE) {
      let indicatedDuplicateTrans = transactionList[index]
      transactionReq.duplicateId = indicatedDuplicateTrans.duplicateId || indicatedDuplicateTrans.id
      transactionReq.duplicateConfidence = rating
    }
  }
  return transactionReq
}

async function processMatchingTransaction(transactionReq: TransactionRequest, transactionList: TransactionModel[]) {
  //here transactionlist is  last 2 days for all other banks linked to this user
  for (let i = 0; i < transactionList.length; i++) {
    let currTransaction = transactionList[i]    
    let transactionType: TransactionType = enumFromStringValue(TransactionType, currTransaction.transactionType.toUpperCase())
    if (transactionType) {
      if (transactionType === TransactionType.CHECK) {
        const { index, rating } = stringSimilarityScore(transactionReq.transactionReferenceId, [currTransaction.transactionReferenceId])
        if (index == 0 && rating >= Constants.CUTOFF_MATCHING_TRANS_REFERENCE_CON) {
          transactionReq.matchingId = currTransaction.id
          transactionReq.matchingConfidence = rating
          //TODO - After storing this, we need to store ID for this transaction to match id of parent trans
          break;
        }
      } else {
        if (transactionType === enumFromStringValue(TransactionType, transactionReq.transactionType.toUpperCase())) {
          transactionReq.matchingId = currTransaction.id
          transactionReq.matchingConfidence = Constants.DEFAULT_MATCHING_TRANS_REFERENCE_CON
          break;
        }
      }
    }
  }
  return transactionReq
}

async function billPaymentsException(transactionReq: TransactionRequest, transactionList: TransactionModel[]){
  const dateList = transactionList.map(trans => {return trans.transactionAt})
  let i = await findClosestDate(dateList,transactionReq.transactionAt)
  let matchedTransaction = transactionList[i]
  transactionReq.matchingId = matchedTransaction.id
  transactionReq.matchingConfidence = Constants.DEFAULT_MATCHING_TRANS_REFERENCE_CON
  // transactionReq.transactionDescription = `${issuer.Name} ${billInfo.billType display name}`
  return transactionReq
}

