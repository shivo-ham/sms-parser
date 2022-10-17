import { ITransactionHandler } from './handlerInterface';
import { TransactionRequest } from '../dataModels/TransactionRequest';
export declare class HdfcBankHandler implements ITransactionHandler {
    static TxnStartString: {
        UPI: string;
        EMI: string;
        IMPS: string;
        NEFT: string;
        RTGS: string;
        ACH: string;
        RD: string;
        FD: string;
    };
    TxnContainsStrings: {
        Salary: string;
    };
    processTransactionDescription(transactionRequest: TransactionRequest, smsSender: string): TransactionRequest;
}
