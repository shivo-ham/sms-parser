import { ITransactionHandler } from './handlerInterface';
import { TransactionRequest } from '../dataModels/TransactionRequest';
export declare class ICICIBankHandler implements ITransactionHandler {
    static Mmt: string;
    static Salary: string;
    static NEFT: string;
    static BIL: string;
    static ACH: string;
    static BYCASH: string;
    static RTGS: string;
    static NFS: string;
    static ATM: string;
    static CAM: string;
    static RCHG: string;
    static EMI: string;
    static BPAY: string;
    static TOFD: string;
    static TORD: string;
    static IWISH: string;
    static CLOSURE: string;
    processTransactionDescription(transactionRequest: TransactionRequest, smsSender: string): TransactionRequest;
}
