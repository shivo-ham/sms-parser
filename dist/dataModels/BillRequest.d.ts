export interface BillRequest {
    id: number;
    accountId: number;
    recurrenceCycle: number;
    generationDate: number;
    dueDate: number;
    smsId: any;
}
