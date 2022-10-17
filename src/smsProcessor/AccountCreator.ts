import { DBOperator } from "../database/DBOperator";
import { AccountType } from "../dataModels/AccountType";
import { SmsModel } from "../dataModels/SmsModel";
import { BillAccount } from "./BillAccount";
import { CreditCardAccount } from "./CreditCardAccount";
import { PPIAccount } from "./PPIAccount";
import { SavingsAccount } from "./SavingsAccount";

export interface IAccount {
  /**
   * The method implments how the parsed SMS needs to be processed and stored in tables
   *   
   * @param customerId integeral customer id
   * @param smsParsedData parsed data object returned after parsing sms content against regex pattern
   * @param dbOperator DBoperator instance for client
   * @param smsId integral sms id
   */
  processSms(customerId:number, smsParsedData:any, dbOperator:DBOperator, sms:SmsModel):Promise<void>
}


export class AccountCreator { 
  /**
   * This method is a factory method used to create Accounts based on types
   * @param accountType AccountType enum value
   * @returns instance of Account created by factory
   */
   static createAccount(accountType: string) : IAccount {
    let account:IAccount
    switch(accountType){
      case AccountType.SAVINGS:
        account = new SavingsAccount()
        break;
      case AccountType.ELECTRIC_BILL:
        account = new BillAccount()
        break;
      case AccountType.MOBILE_BILL:
        account = new BillAccount()
        break;  
      case AccountType.WALLET_PPI:
        account = new PPIAccount()
        break;
      case AccountType.CREDITCARD:
        account = new CreditCardAccount()
        break;  
      default:
        account = null
        console.log("Could not create Account of type : "+ accountType)      
    }
    return account
   }
}
