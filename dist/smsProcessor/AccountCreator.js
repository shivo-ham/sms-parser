"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountCreator = void 0;
const AccountType_1 = require("../dataModels/AccountType");
const BillAccount_1 = require("./BillAccount");
const CreditCardAccount_1 = require("./CreditCardAccount");
const PPIAccount_1 = require("./PPIAccount");
const SavingsAccount_1 = require("./SavingsAccount");
class AccountCreator {
    /**
     * This method is a factory method used to create Accounts based on types
     * @param accountType AccountType enum value
     * @returns instance of Account created by factory
     */
    static createAccount(accountType) {
        let account;
        switch (accountType) {
            case AccountType_1.AccountType.SAVINGS:
                account = new SavingsAccount_1.SavingsAccount();
                break;
            case AccountType_1.AccountType.ELECTRIC_BILL:
                account = new BillAccount_1.BillAccount();
                break;
            case AccountType_1.AccountType.MOBILE_BILL:
                account = new BillAccount_1.BillAccount();
                break;
            case AccountType_1.AccountType.WALLET_PPI:
                account = new PPIAccount_1.PPIAccount();
                break;
            case AccountType_1.AccountType.CREDITCARD:
                account = new CreditCardAccount_1.CreditCardAccount();
                break;
            default:
                account = null;
                console.log("Could not create Account of type : " + accountType);
        }
        return account;
    }
}
exports.AccountCreator = AccountCreator;
