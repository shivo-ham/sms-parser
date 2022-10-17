export interface RepeatativeTransactionModel {
  id:number,
  name:string,
  commonDescription:string,
  medianClusterAmount:number,
  minClusterAmount:number,
  maxClusterAmount:number,
  minDateAt:Date,
  maxDateAt:Date,
  category:string,
  recurrenceCycle:string
}