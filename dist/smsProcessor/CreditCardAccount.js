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
exports.CreditCardAccount = void 0;
const AccountFlowHelper_1 = require("../utils/AccountFlowHelper");
const TransactionUtil_1 = require("../utils/TransactionUtil");
class CreditCardAccount {
    // FIXME: Need to handle CC_STATEMENT, REPAYMENT, REMINDER
    processSms(customerId, smsParsedData, dbOperator) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionType = smsParsedData["transaction_type"];
            switch (transactionType) {
                case "CC_BALANCE":
                    yield this.ccBalanceProcessing(customerId, smsParsedData, dbOperator);
                    break;
                case "CC_TRANSACTION":
                    yield this.ccTransactionProcessing(customerId, smsParsedData, dbOperator);
                    break;
                case "CC_STATEMENT":
                    yield this.ccStatementProcessing(customerId, smsParsedData, dbOperator);
                    break;
            }
        });
    }
    ccTransactionProcessing(customerId, smsParsedData, dbOperator) {
        return __awaiter(this, void 0, void 0, function* () {
            let accountRequest = {
                customerId: customerId,
                accountType: smsParsedData["account_type"],
                smsFrom: smsParsedData["sms_from"],
                smsId: smsParsedData["sms_id"],
                accountNumber: smsParsedData["account_number"],
                actualAccountNumber: smsParsedData["actual_account_number"],
                upiId: null
            };
            accountRequest.phoneNumber = 0;
            accountRequest.upiId = smsParsedData['upi_number'];
            let accountId = yield (0, AccountFlowHelper_1.checkAccount)(accountRequest, dbOperator);
            let creditCardReq = {
                smsId: smsParsedData["sms_id"],
                accountId: accountId,
                cardType: "CREDITCARD",
                brand: smsParsedData["cc_brand_name"],
                cardNetwork: null,
                totalCreditLine: smsParsedData["cc_available_limit"],
                availableCreditLine: smsParsedData["cc_outstanding_balance"],
                totalCreditAt: smsParsedData["transaction_date"],
                availableCreditAt: smsParsedData["transaction_date"]
            };
            let billInfoReq;
            let messageType = smsParsedData["message_type"];
            let transactionReq = {
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
                matchingId: null,
                matchingConfidence: null,
                duplicateId: null,
                duplicateConfidence: null
            };
            if (messageType === 'DEBIT') {
                transactionReq.amount = -1 * transactionReq.amount;
            }
            if (messageType === 'CC_REPAYMENT') {
                transactionReq.transactionDescription = 'Credit Card Payment';
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
                };
                // billInfoReq.paymentAt = smsParsedData['transaction_date']
                let billInfoId = yield (0, AccountFlowHelper_1.updateBillInfos)(billInfoReq, dbOperator);
                if (billInfoId) {
                    transactionReq.billInfoId = billInfoId;
                }
                transactionReq.billInfoId = billInfoId;
                transactionReq = yield (0, TransactionUtil_1.checkTransaction)(transactionReq, smsParsedData["sms_from"], dbOperator);
            }
            yield dbOperator.storeCreditCard(creditCardReq);
            yield dbOperator.storeTransactionData(transactionReq, smsParsedData['sms_id']);
        });
    }
    ccBalanceProcessing(customerId, smsParsedData, dbOperator) {
        return __awaiter(this, void 0, void 0, function* () {
            let accountRequest = {
                customerId: customerId,
                actualAccountNumber: smsParsedData["actualAccountNumber"],
                accountType: smsParsedData["account_type"],
                smsFrom: smsParsedData["sms_from"],
                smsId: smsParsedData["sms_id"],
                accountNumber: smsParsedData["account_number"],
                upiId: null
            };
            accountRequest.phoneNumber = 0;
            accountRequest.upiId = smsParsedData['upi_number'];
            let accountId = yield (0, AccountFlowHelper_1.checkAccount)(accountRequest, dbOperator);
            let creditCardReq = {
                smsId: smsParsedData["sms_id"],
                accountId: accountId,
                cardType: "CREDITCARD",
                brand: smsParsedData["cc_brand_name"],
                cardNetwork: null,
                totalCreditLine: smsParsedData["cc_available_limit"],
                availableCreditLine: smsParsedData["cc_outstanding_balance"],
                totalCreditAt: smsParsedData['transaction_date'],
                availableCreditAt: smsParsedData['transaction_date']
            };
            yield dbOperator.storeCreditCard(creditCardReq);
        });
    }
    ccStatementProcessing(customerId, smsParsedData, dbOperator) {
        return __awaiter(this, void 0, void 0, function* () {
            let generationAt = smsParsedData["bill_generation_date"];
            let dueAt = smsParsedData["cc_pmt_due_date"];
            let accountRequest = {
                accountType: smsParsedData["account_type"],
                smsFrom: smsParsedData["sms_from"],
                smsId: smsParsedData["sms_id"],
                accountNumber: smsParsedData["account_number"],
                actualAccountNumber: smsParsedData["actual_account_number"],
                customerId: customerId,
                upiId: null
            };
            accountRequest.phoneNumber = 0;
            accountRequest.upiId = smsParsedData['upi_number'];
            let accountId = yield (0, AccountFlowHelper_1.checkAccount)(accountRequest, dbOperator);
            let creditCardReq = {
                smsId: smsParsedData["sms_id"],
                accountId: accountId,
                cardType: "CREDITCARD",
                brand: smsParsedData["cc_brand_name"],
                cardNetwork: null,
                totalCreditLine: smsParsedData["cc_available_limit"],
                availableCreditLine: smsParsedData["cc_outstanding_balance"],
                totalCreditAt: smsParsedData["transaction_date"],
                availableCreditAt: smsParsedData["transaction_date"]
            };
            //Delete account balance
            yield dbOperator.storeCreditCard(creditCardReq);
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
            //TODO - Payment related data  not required(paymentAt, paidAmount)
            let billInfoReq = {
                id: 0,
                paymentStatus: billPaymentStatus,
                billedAmount: smsParsedData["cc_total_amt_due"],
                minimumAmount: smsParsedData["cc_min_amt_due"],
                smsId: smsParsedData["sms_id"],
                accountId: accountId,
                generationAt: smsParsedData["bill_generation_date"],
                dueAt: smsParsedData["cc_pmt_due_date"] || smsParsedData["bill_due_date"]
            };
            if (billInfoReq.dueAt === null) {
                if (smsParsedData["transaction_type"] = 'BILL_IMMEDIATE') {
                    //TODO - set data to previous day
                }
                else if (smsParsedData["transaction_type"] = 'BILL_DUE_TODAY') {
                    //TODO - set data as current date
                }
            }
            yield (0, AccountFlowHelper_1.createOrUpdateBillInfos)(billInfoReq, dbOperator);
        });
    }
}
exports.CreditCardAccount = CreditCardAccount;
