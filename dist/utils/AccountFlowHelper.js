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
exports.createBillTransactionForCC = exports.createOrUpdateCards = exports.checkAccount = exports.createOrUpdateBills = exports.updateBillInfos = exports.createOrUpdateBillInfos = void 0;
// FIXME: Same as below. Duplicate
function createOrUpdateBillInfos(billInfoReq, dbOperator) {
    return __awaiter(this, void 0, void 0, function* () {
        //TODO - search by due date and generation date (for statement)
        // FOr repayment - as below
        let billInfo = yield dbOperator.fetchLatestUnpaidBillInfoByAccountId(billInfoReq.accountId);
        let billInfoId;
        if (billInfo) {
            billInfoReq.id = billInfo.id;
            billInfoId = yield dbOperator.updateBillsInfo(billInfoReq);
        }
        else {
            billInfoId = yield dbOperator.storeBillInfos(billInfoReq);
        }
        return billInfoId;
    });
}
exports.createOrUpdateBillInfos = createOrUpdateBillInfos;
// FIXME: this should be storeBillInfo to be implemented in the DbOperator - takes care of create / update
function updateBillInfos(billInfoReq, dbOperator) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Inside Update Bill Infos");
        //TODO - 
        let billInfo = yield dbOperator.fetchLatestUnpaidBillInfoByAccountId(billInfoReq.accountId);
        //If unpaid bill info there, there will be bill_amount key, then comapre tranxn_amount(amount paid)
        //and if they are same it is PAID, if less the PARTIAL_PAID and update status here itself
        let billInfoId;
        if (billInfo) {
            billInfoReq.id = billInfo.id;
            billInfoId = yield dbOperator.updateBillsInfo(billInfoReq);
        }
        else {
            billInfoId = yield dbOperator.storeBillInfos(billInfoReq);
        }
        console.log("Returning Bill Infos ID :" + billInfoId);
        return billInfoId;
    });
}
exports.updateBillInfos = updateBillInfos;
// FIXME: This logic incorrect and not needed. Need to have a storeBill ( like storeCreditCard )
function createOrUpdateBills(billRequest, dbOperator) {
    return __awaiter(this, void 0, void 0, function* () {
        let billId = yield dbOperator.fetchBillByAccountId(billRequest.accountId);
        if (typeof billId === 'undefined') {
            console.log("Creating Bill entity");
            billId = yield dbOperator.createNewBill(billRequest);
        }
    });
}
exports.createOrUpdateBills = createOrUpdateBills;
function checkAccount(accountRequest, dbOperator) {
    return __awaiter(this, void 0, void 0, function* () {
        let accountId = yield dbOperator.fetchAccountIdByAccountTypeAndNumberAndIssuer(accountRequest.accountType, accountRequest.accountNumber, accountRequest.smsFrom);
        console.log("Account ID in check account : " + JSON.stringify(accountId));
        if (typeof accountId === 'undefined') {
            console.log("Creating Account entity");
            accountId = yield dbOperator.createNewAccount(accountRequest);
        }
        return new Promise((resolve) => { resolve(accountId); });
    });
}
exports.checkAccount = checkAccount;
// FIXME: This logic not needed
function createOrUpdateCards(creditCardReq, dbOperator) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Inside create or update cards");
        let cardId = yield dbOperator.fetchCardsByAccountId(creditCardReq.accountId);
        if (typeof cardId === 'undefined') {
            console.log("Creating card entity");
            cardId = yield dbOperator.storeCreditCard(creditCardReq);
        }
        console.log("card ID is :" + cardId);
    });
}
exports.createOrUpdateCards = createOrUpdateCards;
// FIXME: This logic Not needed
function createBillTransactionForCC(smsId, transactionReq, dbOperator) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Inside create Bill Transaction for cc");
        let transactionId = yield dbOperator.fetchTransactionsByAccountId(transactionReq.accountId);
        console.log("Transaction ID is :" + transactionId);
        if (typeof transactionId === 'undefined') {
            console.log("Creating card entity");
            transactionId = yield dbOperator.storeTransactionData(transactionReq, smsId);
        }
        console.log("Transaction ID is " + transactionId);
    });
}
exports.createBillTransactionForCC = createBillTransactionForCC;
