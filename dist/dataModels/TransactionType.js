"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingTransferTransactions = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["LOAN_STATEMENT"] = "LOAN_STATEMENT";
    TransactionType["LOAN_EMI_CONFIRMATION"] = "LOAN_EMI_CONFIRMATION";
    TransactionType["LOAN_OPEN"] = "LOAN_OPEN";
    TransactionType["LOAN_CLOSE"] = "LOAN_CLOSE";
    TransactionType["LOAN_EMI_REMINDER"] = "LOAN_EMI_REMINDER";
    TransactionType["LOAN_AUTO_DEBIT_BOUNCE"] = "LOAN_AUTO_DEBIT_BOUNCE";
    TransactionType["CC_BALANCE"] = "CC_BALANCE";
    TransactionType["CC_TRANSACTION"] = "CC_TRANSACTION";
    TransactionType["CC_TRANSACTION_INFORMATION"] = "CC_TRANSACTION_INFORMATION";
    TransactionType["CC_STATEMENT"] = "CC_STATEMENT";
    TransactionType["CC_REMINDER"] = "CC_REMINDER";
    TransactionType["CC_LOAN"] = "CC_LOAN";
    TransactionType["CC_LOAN_EMI"] = "CC_LOAN_EMI";
    TransactionType["DC_TRANSACTION"] = "DC_TRANSACTION";
    TransactionType["DC_TRANSACTION_BALANCE"] = "DC_TRANSACTION_BALANCE";
    TransactionType["DC_ATM"] = "DC_ATM";
    TransactionType["BILL_GENERATION"] = "BILL_GENERATION";
    TransactionType["BILL_INFORMATION"] = "BILL_INFORMATION";
    TransactionType["BILL_CONFIRMATION"] = "BILL_CONFIRMATION";
    TransactionType["BILL_TXN_CONFIRMATION"] = "BILL_TXN_CONFIRMATION";
    TransactionType["CASA_BALANCE"] = "CASA_BALANCE";
    TransactionType["CASA_CHECK_BOUNCE"] = "CASA_CHECK_BOUNCE";
    TransactionType["CASA_AUTO_DEBIT_REJECT"] = "CASA_AUTO_DEBIT_REJECT";
    TransactionType["CASA_BELOW_MAB"] = "CASA_BELOW_MAB";
    TransactionType["UPI"] = "UPI";
    TransactionType["NEFT"] = "NEFT";
    TransactionType["RTGS"] = "RTGS";
    TransactionType["TRANSFER"] = "TRANSFER";
    TransactionType["WALLET_LOAD"] = "WALLET_LOAD";
    TransactionType["CC_BILL_PAYMENT"] = "CC_BILL_PAYMENT";
    TransactionType["IMPS"] = "IMPS";
    TransactionType["CC_STANDING_INSTRUCTION"] = "CC_STANDING_INSTRUCTION";
    TransactionType["NACH"] = "NACH";
    TransactionType["BILL_IMMEDIATE"] = "BILL_IMMEDIATE";
    TransactionType["BILL_DUE_TODAY"] = "BILL_DUE_TODAY";
    TransactionType["SALARY"] = "SALARY";
    TransactionType["CASH_DEPOSIT"] = "CASH_DEPOSIT";
    TransactionType["FEES_CHARGES"] = "FEES_CHARGES";
    TransactionType["ATM_WITHDRAWAL"] = "ATM_WITHDRAWAL";
    TransactionType["CHECK"] = "CHECK";
    TransactionType["MERCHANT"] = "MERCHANT";
    TransactionType["NETBANKING"] = "NETBANKING";
    TransactionType["LOAN_EMI"] = "LOAN_EMI";
    TransactionType["CASA_FD"] = "CASA_FD";
    TransactionType["CASA_RD"] = "CASA_RD";
    TransactionType["ECS"] = "ECS";
    TransactionType["CC_AUTOPAY"] = "CC_AUTOPAY";
    TransactionType["DC_AUTOPAY"] = "DC_AUTOPAY";
    TransactionType["RECHARGE"] = "RECHARGE";
    TransactionType["BILL_PAYMENT"] = "BILL_PAYMENT";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
exports.BankingTransferTransactions = [
    TransactionType.UPI.toString(),
    TransactionType.NEFT.toString(),
    TransactionType.RTGS.toString(),
    TransactionType.TRANSFER.toString(),
    TransactionType.IMPS.toString(),
    TransactionType.SALARY.toString(),
    TransactionType.NACH.toString(),
    TransactionType.NETBANKING.toString(),
    TransactionType.CHECK.toString()
];
