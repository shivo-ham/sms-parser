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
exports.SavingsAccount = void 0;
const MessageType_1 = require("../dataModels/MessageType");
const TransactionTimeSourceType_1 = require("../dataModels/TransactionTimeSourceType");
const TransactionUtil_1 = require("../utils/TransactionUtil");
const AccountFlowHelper_1 = require("../utils/AccountFlowHelper");
class SavingsAccount {
    /**
     * Implementation of savings parseSms method based on transaction request, account request
     * and accountBalance request
     *
     */
    processSms(customerId, smsParsedData, dbOperator) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionRequest = {
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
                duplicateConfidence: null,
                duplicateId: null,
                matchingId: null,
                matchingConfidence: null,
                // FIXME: Default to this value. Will change after parser implementation
                transactionTimeSource: TransactionTimeSourceType_1.TransactionTimeSourceType.FROM_SMS.valueOf(),
                accountBalance: smsParsedData['available_balance']
            };
            if (smsParsedData['message_type'] === MessageType_1.MessageType.DEBIT) {
                transactionRequest.amount = -1 * Number(smsParsedData['transaction_amount']);
            }
            else {
                transactionRequest.amount = Number(smsParsedData['transaction_amount']);
            }
            let accountRequest = {
                customerId: customerId,
                accountType: smsParsedData['account_type'],
                smsFrom: smsParsedData["sms_from"],
                smsId: smsParsedData["sms_id"],
                accountNumber: smsParsedData['account_number'],
                actualAccountNumber: smsParsedData['actual_account_number'],
                upiId: smsParsedData['upi_number']
            };
            accountRequest.phoneNumber = 0;
            // accountRequest.upiId = smsParsedData['upi_number']
            let accountId = yield (0, AccountFlowHelper_1.checkAccount)(accountRequest, dbOperator);
            let accountBalanceRequest = {
                accountId: accountId,
                balanceAt: smsParsedData['transaction_date'],
                balanceAmount: smsParsedData['available_balance'],
                smsId: smsParsedData["sms_id"]
            };
            transactionRequest.accountId = accountId;
            transactionRequest = yield (0, TransactionUtil_1.checkTransaction)(transactionRequest, smsParsedData["sms_from"], dbOperator);
            yield dbOperator.storeTransactionData(transactionRequest, smsParsedData["sms_id"]);
            yield dbOperator.storeAccountBalance(accountBalanceRequest);
        });
    }
}
exports.SavingsAccount = SavingsAccount;
