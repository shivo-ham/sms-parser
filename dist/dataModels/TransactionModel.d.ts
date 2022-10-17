export interface TransactionModel {
    id: number;
    accountId: number;
    amount: number;
    balance: number;
    balanceType: string;
    category: string;
    categoryType: string;
    duplicateId: number;
    duplicateConfidence: number;
    generationType: string;
    matchingId: number;
    matchingConfidence: number;
    selfTransfer: boolean;
    smsId?: any;
    transactionTimeSource: string;
    transactionDescription: string;
    transactionReferenceId: string;
    transactionAt: Date;
    transactionType: string;
    repeatPaymentId: number;
    billInfoId: number;
}
