export interface RepeatativeTransactionRequest {
    name: string;
    commonDescription: string;
    medianClusterAmount: number;
    minClusterAmount: number;
    maxClusterAmount: number;
    minDateAt: Date;
    maxDateAt: Date;
    category?: string;
    recurrenceCycle?: string;
}
