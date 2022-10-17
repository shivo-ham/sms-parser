export interface TransactionRequest {
    accountId: number;
    accountNumber: string;
    accountType: string;
    accountBalance: number;
    balanceType: string;
    transactionDescription: string;
    transactionDescriptionRaw?: string;
    category: string;
    categoryType: string;
    transactionReferenceId: string;
    transactionAt: Date;
    transactionType: string;
    amount: number;
    billInfoId?: number;
    messageType: string;
    transactionTimeSource: string;
    generationType: string;
    duplicateId: number;
    duplicateConfidence: number;
    matchingId: number;
    matchingConfidence: number;
}
