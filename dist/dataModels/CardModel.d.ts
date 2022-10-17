export interface CardModel {
    id: number;
    accountId: number;
    cardType: string;
    brand: string;
    cardNetwork: string;
    totalCreditLine: number;
    availableCreditLine: number;
    totalCreditAt: Date;
    availableCreditAt: Date;
}
