export interface SmsDataBaseModel {
    _id: number;
    address: string;
    date_sent: string;
    body: string;
    original?: string;
    sim_imsi?: string;
    date: string;
}
