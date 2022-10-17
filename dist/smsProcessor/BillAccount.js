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
exports.BillAccount = void 0;
const AccountFlowHelper_1 = require("../utils/AccountFlowHelper");
const TransactionUtil_1 = require("../utils/TransactionUtil");
class BillAccount {
    // FIXME: Bill transaction will result in duplicate entries. Need to handle all cases for bills. 
    processSms(customerId, smsParsedData, dbOperator) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionType = smsParsedData["transaction_type"];
            switch (transactionType) {
                case "BILL_GENERATION":
                    yield this.billStatementGeneration(customerId, smsParsedData, dbOperator);
                    break;
                case "BILL_CONFIRMATION":
                    yield this.billConfirmation(customerId, smsParsedData, dbOperator);
                    break;
                case "BILL_IMMEDIATE":
                    yield this.billStatementGeneration(customerId, smsParsedData, dbOperator);
                    break;
                case "BILL_DUE_DATE":
                    yield this.billStatementGeneration(customerId, smsParsedData, dbOperator);
                    break;
            }
        });
    }
    billStatementGeneration(customerId, smsParsedData, dbOperator) {
        return __awaiter(this, void 0, void 0, function* () {
            let generationAt = smsParsedData["bill_generation_date"];
            let dueAt = smsParsedData["bill_due_date"];
            let accountRequest = {
                accountType: smsParsedData["account_type"],
                smsFrom: smsParsedData["sms_from"],
                smsId: smsParsedData["sms_id"],
                accountNumber: smsParsedData["account_number"],
                actualAccountNumber: smsParsedData["actual_account_number"],
                customerId: customerId,
                upiId: null
            };
            let accountId = yield (0, AccountFlowHelper_1.checkAccount)(accountRequest, dbOperator);
            let billRequest = {
                id: 0,
                accountId: accountId,
                recurrenceCycle: 1,
                generationDate: (generationAt === null) ? null : generationAt.getDate(),
                dueDate: (dueAt === null) ? null : dueAt.getDate(),
                smsId: smsParsedData["sms_id"]
            };
            yield (0, AccountFlowHelper_1.createOrUpdateBills)(billRequest, dbOperator);
            let billPaymentStatus = 'UNPAID';
            let billInfoReq = {
                id: 0,
                paidAmount: null,
                paymentAt: null,
                paymentStatus: billPaymentStatus,
                billedAmount: smsParsedData["bill_amount"],
                minimumAmount: 0,
                smsId: smsParsedData["sms_id"],
                accountId: accountId,
                generationAt: generationAt,
                dueAt: dueAt
            };
            if (billInfoReq.dueAt === null) {
                if (smsParsedData["transaction_type"] = 'BILL_IMMEDIATE') {
                    //TODO - set date to previous day
                }
                else if (smsParsedData["transaction_type"] = 'BILL_DUE_TODAY') {
                    //TODO - set date as current date
                }
            }
            yield (0, AccountFlowHelper_1.createOrUpdateBillInfos)(billInfoReq, dbOperator);
        });
    }
    billConfirmation(customerId, smsParsed, dbOperator) {
        return __awaiter(this, void 0, void 0, function* () {
            let generationAt = smsParsed["bill_generation_date"];
            let dueAt = smsParsed["bill_due_date"];
            let accountRequest = {
                customerId: customerId,
                accountType: smsParsed["account_type"],
                smsFrom: smsParsed["sms_from"],
                smsId: smsParsed["sms_id"],
                accountNumber: smsParsed["account_number"],
                actualAccountNumber: smsParsed["actual_account_number"],
                upiId: null
            };
            let accountId = yield (0, AccountFlowHelper_1.checkAccount)(accountRequest, dbOperator);
            let billRequest = {
                id: 0,
                accountId: accountId,
                recurrenceCycle: 1,
                generationDate: (generationAt === null) ? null : generationAt.getDate(),
                dueDate: (dueAt === null) ? null : dueAt.getDate(),
                smsId: smsParsed["sms_id"]
            };
            yield (0, AccountFlowHelper_1.createOrUpdateBills)(billRequest, dbOperator);
            let billPaymentStatus = "PAID";
            if (smsParsed["message_type"] === "BILL_PAYMENT") {
                billPaymentStatus = "PAID";
            }
            let billInfoReq = {
                id: 0,
                paymentAt: smsParsed['transaction_date'],
                paymentStatus: billPaymentStatus,
                paidAmount: smsParsed["transaction_amount"],
                billedAmount: null,
                minimumAmount: 0,
                smsId: smsParsed["sms_id"],
                accountId: accountId,
                generationAt: null,
                dueAt: null
            };
            //TODO - Rather call Update Bill infos as generation_at, due date is not there
            let billInfoId = yield (0, AccountFlowHelper_1.updateBillInfos)(billInfoReq, dbOperator);
            let transactionReq = {
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
                matchingId: null,
                matchingConfidence: null,
                duplicateId: null,
                duplicateConfidence: null
            };
            //check matching
            transactionReq = yield (0, TransactionUtil_1.checkTransaction)(transactionReq, smsParsed["sms_from"], dbOperator);
            yield dbOperator.storeTransactionData(transactionReq, Number(smsParsed["sms_id"]));
        });
    }
}
exports.BillAccount = BillAccount;
