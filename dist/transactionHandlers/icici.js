"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICICIBankHandler = void 0;
const TransactionType_1 = require("../dataModels/TransactionType");
class ICICIBankHandler {
    // FIXME: To handle variations in #627 ( FD related), 630
    processTransactionDescription(transactionRequest, smsSender) {
        const { transactionDescription, transactionType, transactionReferenceId } = transactionRequest;
        if (transactionType === TransactionType_1.TransactionType.TRANSFER) {
            if (transactionDescription.toLowerCase().startsWith(ICICIBankHandler.NEFT)) {
                const parts = transactionDescription.split('-');
                if (parts.length > 2) {
                    transactionRequest.transactionReferenceId = parts[1];
                    transactionRequest.transactionDescription = parts[2];
                }
            }
            else if (transactionDescription.toLowerCase().startsWith(ICICIBankHandler.ACH)) {
                const parts = transactionDescription.split('*');
                if (parts.length > 2) {
                    transactionRequest.transactionReferenceId = parts[2];
                    transactionRequest.transactionDescription = parts[1];
                }
            }
            else if (transactionReferenceId.toLowerCase().startsWith(ICICIBankHandler.NEFT) || transactionReferenceId.toLowerCase().startsWith(ICICIBankHandler.RTGS)) {
                const parts = transactionReferenceId.split('-');
                if (parts.length > 1) {
                    transactionRequest.transactionReferenceId = parts[1];
                    transactionRequest.transactionType = transactionReferenceId.toLowerCase().startsWith(ICICIBankHandler.NEFT) ? TransactionType_1.TransactionType.NEFT : TransactionType_1.TransactionType.RTGS;
                }
            }
            else if (transactionReferenceId.toLowerCase().startsWith(ICICIBankHandler.ACH)) {
                const refParts = transactionReferenceId.split('*');
                const descParts = transactionDescription.split('*');
                if (refParts.length > 0 && descParts.length > 1) {
                    transactionRequest.transactionDescription = `${refParts[1]}-${descParts[0]}`;
                    transactionRequest.transactionReferenceId = descParts[1];
                }
            }
            else if (transactionReferenceId.toLowerCase().startsWith(ICICIBankHandler.BIL)) {
                const parts = transactionReferenceId.split('*');
                if (parts.length >= 2) {
                    transactionRequest.transactionReferenceId = parts[1];
                }
                if (parts.length >= 3) {
                    transactionRequest.transactionDescription = `${parts[2]} ${transactionDescription}`;
                }
            }
            else if (transactionReferenceId.toLowerCase().startsWith(ICICIBankHandler.BYCASH)) {
                transactionRequest.transactionDescription = `${transactionRequest.transactionReferenceId}-${transactionRequest.transactionDescription}`;
                transactionRequest.transactionReferenceId = '';
            }
            else if (transactionDescription.toLowerCase().startsWith(ICICIBankHandler.ATM) ||
                transactionDescription.toLowerCase().startsWith(ICICIBankHandler.NFS) ||
                transactionDescription.toLowerCase().startsWith(ICICIBankHandler.CAM)) {
                transactionRequest.transactionType = TransactionType_1.TransactionType.ATM_WITHDRAWAL;
            }
            else if (transactionDescription.toLowerCase().startsWith(ICICIBankHandler.BIL)) {
                if (transactionDescription.toLowerCase().indexOf(ICICIBankHandler.EMI)) {
                    transactionRequest.transactionType = TransactionType_1.TransactionType.LOAN_EMI;
                }
                else if (transactionDescription.toLowerCase().indexOf(ICICIBankHandler.BPAY)) {
                    transactionRequest.transactionType = TransactionType_1.TransactionType.BILL_PAYMENT;
                }
                else if (transactionDescription.toLowerCase().indexOf(ICICIBankHandler.RCHG)) {
                    transactionRequest.transactionType = TransactionType_1.TransactionType.RECHARGE;
                }
                if (transactionDescription.toLowerCase().indexOf(ICICIBankHandler.TORD) ||
                    transactionDescription.toLowerCase().indexOf(ICICIBankHandler.IWISH)) {
                    transactionRequest.transactionType = TransactionType_1.TransactionType.CASA_RD;
                }
                if (transactionDescription.toLowerCase().indexOf(ICICIBankHandler.TOFD)) {
                    transactionRequest.transactionType = TransactionType_1.TransactionType.CASA_FD;
                }
            }
        }
        else if (transactionType === TransactionType_1.TransactionType.CC_TRANSACTION) {
            const parts = transactionDescription.split('*');
            if (parts.length > 0) {
                transactionRequest.transactionDescription = parts[1];
            }
        }
        return transactionRequest;
    }
}
exports.ICICIBankHandler = ICICIBankHandler;
ICICIBankHandler.Mmt = 'MMT';
ICICIBankHandler.Salary = 'salary';
ICICIBankHandler.NEFT = 'neft';
ICICIBankHandler.BIL = 'bil';
ICICIBankHandler.ACH = 'ach';
ICICIBankHandler.BYCASH = 'by cash';
ICICIBankHandler.RTGS = 'rtgs';
ICICIBankHandler.NFS = 'nfs';
ICICIBankHandler.ATM = 'atm';
ICICIBankHandler.CAM = 'cam';
ICICIBankHandler.RCHG = 'rchg';
ICICIBankHandler.EMI = 'emi';
ICICIBankHandler.BPAY = 'bpay';
ICICIBankHandler.TOFD = 'trf to fd';
ICICIBankHandler.TORD = 'trf to rd';
ICICIBankHandler.IWISH = 'iwish';
ICICIBankHandler.CLOSURE = 'closure proceeds';
