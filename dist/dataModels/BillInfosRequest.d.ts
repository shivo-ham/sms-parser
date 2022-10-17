export interface BillInfosRequest {
    id: any;
    paymentAt?: Date;
    paymentStatus: string;
    paidAmount?: number;
    billedAmount: number;
    minimumAmount: number;
    smsId: any;
    accountId: number;
    generationAt: Date;
    dueAt: Date;
}
