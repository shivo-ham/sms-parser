"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTransaction = void 0;
const StringUtil_1 = require("./StringUtil");
const Constants_1 = require("../configs/Constants");
const TransactionType_1 = require("../dataModels/TransactionType");
const DateUtil_1 = require("./DateUtil");
function checkTransaction(transactionReq, smsFrom, dbOperator) {
    return __awaiter(this, void 0, void 0, function* () {
        let duplicateWindow = yield (0, DateUtil_1.getTimeWithOffsetInMinutes)(transactionReq.transactionAt, Constants_1.Constants.DUPLICATE_TRANSACTION_BUFFER_TIME);
        let transactionList = yield dbOperator.fetchTransactionsByAmountAndAccountNumberBetweenDates(transactionReq.amount, transactionReq.accountNumber, duplicateWindow, transactionReq.transactionAt);
        if (transactionList.length > 0) {
            transactionReq = yield processDuplicateTransaction(transactionReq, transactionList);
        }
        let matchingWindow = yield (0, DateUtil_1.getTimeWithOffsetInMinutes)(transactionReq.transactionAt, Constants_1.Constants.MATCHING_TRANSACTION_BUFFER_TIME);
        let matchingTransList = yield dbOperator.fetchTransactionByAmountBetweenDates(-1 * transactionReq.amount, matchingWindow, transactionReq.transactionAt);
        if (transactionReq.transactionType === TransactionType_1.TransactionType.CC_BILL_PAYMENT ||
            transactionReq.transactionType === TransactionType_1.TransactionType.BILL_CONFIRMATION) {
            transactionReq = yield billPaymentsException(transactionReq, matchingTransList);
        }
        else {
            matchingTransList = matchingTransList.filter(item => !(item.accountId === transactionReq.accountId));
            transactionReq = yield processMatchingTransaction(transactionReq, matchingTransList);
        }
        return transactionReq;
    });
}
exports.checkTransaction = checkTransaction;
function processDuplicateTransaction(transactionReq, transactionList) {
    return __awaiter(this, void 0, void 0, function* () {
        if (transactionList.length == 0) {
            console.log("No duplicate transaction found");
            return transactionReq;
        }
        else {
            let estimatedDupTransaction = transactionList[0];
            transactionReq.duplicateId = estimatedDupTransaction.id;
            transactionReq.duplicateConfidence = Constants_1.Constants.DEAFAULT_DUPLICATE_TRANS_DESCRIPTION_CONFIDENCE;
        }
        let currTransactionRefNum = transactionReq.transactionReferenceId;
        if (currTransactionRefNum) {
            let transRefList = transactionList.map((trxn) => { return trxn.transactionReferenceId; });
            const { index, rating } = (0, StringUtil_1.stringSimilarityScore)(currTransactionRefNum, transRefList);
            console.log("Index and ratings are : " + index + ", " + rating);
            if (index >= 0 && rating >= Constants_1.Constants.CUTOFF_DUPLICATE_TRANS_DESCRIPTION_CONFIDENCE) {
                let indicatedDuplicateTrans = transactionList[index];
                transactionReq.duplicateId = indicatedDuplicateTrans.duplicateId || indicatedDuplicateTrans.id;
                transactionReq.duplicateConfidence = rating;
            }
        }
        return transactionReq;
    });
}
function processMatchingTransaction(transactionReq, transactionList) {
    return __awaiter(this, void 0, void 0, function* () {
        //here transactionlist is  last 2 days for all other banks linked to this user
        for (let i = 0; i < transactionList.length; i++) {
            let currTransaction = transactionList[i];
            let transactionType = (0, StringUtil_1.enumFromStringValue)(TransactionType_1.TransactionType, currTransaction.transactionType.toUpperCase());
            if (transactionType) {
                if (transactionType === TransactionType_1.TransactionType.CHECK) {
                    const { index, rating } = (0, StringUtil_1.stringSimilarityScore)(transactionReq.transactionReferenceId, [currTransaction.transactionReferenceId]);
                    if (index == 0 && rating >= Constants_1.Constants.CUTOFF_MATCHING_TRANS_REFERENCE_CON) {
                        transactionReq.matchingId = currTransaction.id;
                        transactionReq.matchingConfidence = rating;
                        //TODO - After storing this, we need to store ID for this transaction to match id of parent trans
                        break;
                    }
                }
                else {
                    if (transactionType === (0, StringUtil_1.enumFromStringValue)(TransactionType_1.TransactionType, transactionReq.transactionType.toUpperCase())) {
                        transactionReq.matchingId = currTransaction.id;
                        transactionReq.matchingConfidence = Constants_1.Constants.DEFAULT_MATCHING_TRANS_REFERENCE_CON;
                        break;
                    }
                }
            }
        }
        return transactionReq;
    });
}
function billPaymentsException(transactionReq, transactionList) {
    return __awaiter(this, void 0, void 0, function* () {
        const dateList = transactionList.map(trans => { return trans.transactionAt; });
        let i = yield (0, DateUtil_1.findClosestDate)(dateList, transactionReq.transactionAt);
        let matchedTransaction = transactionList[i];
        transactionReq.matchingId = matchedTransaction.id;
        transactionReq.matchingConfidence = Constants_1.Constants.DEFAULT_MATCHING_TRANS_REFERENCE_CON;
        // transactionReq.transactionDescription = `${issuer.Name} ${billInfo.billType display name}`
        return transactionReq;
    });
}
