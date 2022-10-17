export interface CreditCardRequest {
  id?:number,
  smsId: any,
  accountId:number,
  cardType:string,
  brand:string,
  cardNetwork:string,
  totalCreditLine:number,
  availableCreditLine:number
  totalCreditAt:Date,
  availableCreditAt:Date
}