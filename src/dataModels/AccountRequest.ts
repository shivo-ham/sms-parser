// FIXME:SmsFrom has to be available. So is smsId. Cant be or underfined
export interface AccountRequest{
  actualAccountNumber:string,
  accountNumber:string,
  customerId:number,
  accountType:string,
  smsFrom:string,
  phoneNumber?:number,
  upiId:any,
  smsId:number
}