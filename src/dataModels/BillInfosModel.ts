export interface BillInfosModel {
  id:number,
  paymentAt:Date,
  paymentStatus:string,
  paidAmount:number,
  billedAmount:number,
  minimumAmmount:number,
  smsId:any,
  accountId:number,
  generationAt:Date,
  dueAt:Date
}
