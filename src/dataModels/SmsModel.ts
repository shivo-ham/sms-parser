import { SmsDataBaseModel } from "./SmsDataBaseModel";

export interface SmsModel {
  id:number,
  smsContent:string,
  smsAt:string,
  smsSentAt: string,
  smsFrom:string,
  smsStatus:string,
  smsClientId?:number,
  customerId:number
}