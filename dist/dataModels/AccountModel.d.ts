export interface AccountModel {
    id: number;
    accountNumber: string;
    accountNumberActual: string;
    accountType: string;
    customerId: string;
    issuerId: string;
    phoneNumber: string;
    upiId: string;
    createdAt?: Date;
    modifiedAt?: Date;
    smsId: any;
}
