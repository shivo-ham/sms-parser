import 'jest'
import { DBOperator } from '../../src/database/DBOperator'
import { AccountBalanceRequest } from '../../src/dataModels/AccountBalanceRequest'
import { AccountRequest } from '../../src/dataModels/AccountRequest'
import { BillInfosModel } from '../../src/dataModels/BillInfosModel'
import { BillInfosRequest } from '../../src/dataModels/BillInfosRequest'
import { BillRequest } from '../../src/dataModels/BillRequest'
import { CreditCardRequest } from '../../src/dataModels/CreditCardRequest'
import { Regex } from '../../src/dataModels/Regex'
import { RepeatativeTransactionRequest } from '../../src/dataModels/RepeatativeTransactionRequest'
import { SmsData } from '../../src/dataModels/SmsData'
import { SmsModel } from '../../src/dataModels/SmsModel'
import { TransactionModel } from '../../src/dataModels/TransactionModel'
import { TransactionRequest } from '../../src/dataModels/TransactionRequest'
import {classifyRepeatativePayments, createRepeatTransactionCluster} from '../../src/recurringPayments/ClusterRecurring'

describe('getCLuster',()=>{
  test('Fetch Cluster',()=>{
    let transactionList:TransactionModel[] = []
    let transaction1:TransactionModel = {
      id: 2,
      accountId: 2,
      amount: -100000,
      balance: 1000000,
      balanceType: '',
      category: '',
      categoryType: '',
      duplicateId: 1,
      duplicateConfidence: 0,
      generationType: '',
      matchingId: 0,
      matchingConfidence: 0,
      selfTransfer: false,
      transactionTimeSource: '',
      transactionDescription: 'NEFT-IDFBH22033461032-RESPO FINANCI',
      transactionReferenceId: '',
      transactionAt: new Date(2022, 7, 7, 11),
      transactionType: '',
      billInfoId: 0,
      repeatPaymentId: 0
    }

    let transaction2:TransactionModel = {
      id: 2,
      accountId: 2,
      amount: -110000,
      balance: 105000,
      balanceType: '',
      category: '',
      categoryType: '',
      duplicateId: 1,
      duplicateConfidence: 0,
      generationType: '',
      matchingId: 0,
      matchingConfidence: 0,
      selfTransfer: false,
      transactionTimeSource: '',
      transactionDescription: 'NEFT-IDFBH23011461032-RESPO FINANCI',
      transactionReferenceId: '',
      transactionAt: new Date(2022, 6, 8, 11),
      transactionType: '',
      billInfoId: 0,
      repeatPaymentId: 0
    }

    let transaction3:TransactionModel = {
      id: 2,
      accountId: 2,
      amount: -110000,
      balance: 105000,
      balanceType: '',
      category: '',
      categoryType: '',
      duplicateId: 1,
      duplicateConfidence: 0,
      generationType: '',
      matchingId: 0,
      matchingConfidence: 0,
      selfTransfer: false,
      transactionTimeSource: '',
      transactionDescription: 'NEFT-IDFBH130184610-RESPO FINANCI',
      transactionReferenceId: '',
      transactionAt: new Date(2022, 5, 8, 11),
      transactionType: '',
      billInfoId: 0,
      repeatPaymentId: 0
    }

    let transaction4:TransactionModel={
      id: 2,
      accountId: 2,
      amount: -10000,
      balance: 105000,
      balanceType: '',
      category: '',
      categoryType: '',
      duplicateId: 1,
      duplicateConfidence: 0,
      generationType: '',
      matchingId: 0,
      matchingConfidence: 0,
      selfTransfer: false,
      transactionTimeSource: '',
      transactionDescription: 'SBIN819112714866',
      transactionReferenceId: '',
      transactionAt: new Date(2022, 8, 23, 11),
      transactionType: '',
      billInfoId: 0,
      repeatPaymentId: 0
    }

    let transaction5:TransactionModel={
      id: 2,
      accountId: 2,
      amount: -9900,
      balance: 105000,
      balanceType: '',
      category: '',
      categoryType: '',
      duplicateId: 1,
      duplicateConfidence: 0,
      generationType: '',
      matchingId: 0,
      matchingConfidence: 0,
      selfTransfer: false,
      transactionTimeSource: '',
      transactionDescription: 'SBIN319105870120',
      transactionReferenceId: '',
      transactionAt: new Date(2022, 7, 24, 11),
      transactionType: '',
      billInfoId: 0,
      repeatPaymentId: 0
    }

    let transaction6:TransactionModel={
      id: 2,
      accountId: 2,
      amount: -10000,
      balance: 105000,
      balanceType: '',
      category: '',
      categoryType: '',
      duplicateId: 1,
      duplicateConfidence: 0,
      generationType: '',
      matchingId: 0,
      matchingConfidence: 0,
      selfTransfer: false,
      transactionTimeSource: '',
      transactionDescription: 'SBIN3133105870120',
      transactionReferenceId: '',
      transactionAt: new Date(2022, 9, 24, 11),
      transactionType: '',
      billInfoId: 0,
      repeatPaymentId: 0
    }

    transactionList.push(transaction1,transaction2,transaction3,transaction4,transaction5,transaction6)
    var result = createRepeatTransactionCluster(transactionList)
    expect(result).toBeDefined()
    expect(result["exemplars"]).toEqual([1,4])
    expect(result["clusters"]).toEqual([1,1,1,4,4,4])
  })
})



describe('classifyRepeatPayments',()=>{
  test('Repeat Payments',()=>{
    let transactionList:TransactionModel[] = []
    let transaction1:TransactionModel = {
      id: 2,
      accountId: 2,
      amount: -100000,
      balance: 1000000,
      balanceType: '',
      category: '',
      categoryType: '',
      duplicateId: 1,
      duplicateConfidence: 0,
      generationType: '',
      matchingId: 0,
      matchingConfidence: 0,
      selfTransfer: false,
      transactionTimeSource: '',
      transactionDescription: 'NEFT-IDFBH22033461032-RESPO FINANCI',
      transactionReferenceId: '',
      transactionAt: new Date(2022, 7, 7, 11),
      transactionType: '',
      billInfoId: 0,
      repeatPaymentId: 0
    }

    let transaction2:TransactionModel = {
      id: 2,
      accountId: 2,
      amount: -110000,
      balance: 105000,
      balanceType: '',
      category: '',
      categoryType: '',
      duplicateId: 1,
      duplicateConfidence: 0,
      generationType: '',
      matchingId: 0,
      matchingConfidence: 0,
      selfTransfer: false,
      transactionTimeSource: '',
      transactionDescription: 'NEFT-IDFBH23011461032-RESPO FINANCI',
      transactionReferenceId: '',
      transactionAt: new Date(2022, 6, 8, 11),
      transactionType: '',
      billInfoId: 0,
      repeatPaymentId: 0
    }

    let transaction3:TransactionModel = {
      id: 2,
      accountId: 2,
      amount: -110000,
      balance: 105000,
      balanceType: '',
      category: '',
      categoryType: '',
      duplicateId: 1,
      duplicateConfidence: 0,
      generationType: '',
      matchingId: 0,
      matchingConfidence: 0,
      selfTransfer: false,
      transactionTimeSource: '',
      transactionDescription: 'NEFT-IDFBH130184610-RESPO FINANCI',
      transactionReferenceId: '',
      transactionAt: new Date(2022, 5, 8, 11),
      transactionType: '',
      billInfoId: 0,
      repeatPaymentId: 0
    }

    let transaction4:TransactionModel={
      id: 2,
      accountId: 2,
      amount: -10000,
      balance: 105000,
      balanceType: '',
      category: '',
      categoryType: '',
      duplicateId: 1,
      duplicateConfidence: 0,
      generationType: '',
      matchingId: 0,
      matchingConfidence: 0,
      selfTransfer: false,
      transactionTimeSource: '',
      transactionDescription: 'SBIN819112714866',
      transactionReferenceId: '',
      transactionAt: new Date(2022, 8, 23, 11),
      transactionType: '',
      billInfoId: 0,
      repeatPaymentId: 0
    }

    let transaction5:TransactionModel={
      id: 2,
      accountId: 2,
      amount: -9900,
      balance: 105000,
      balanceType: '',
      category: '',
      categoryType: '',
      duplicateId: 1,
      duplicateConfidence: 0,
      generationType: '',
      matchingId: 0,
      matchingConfidence: 0,
      selfTransfer: false,
      transactionTimeSource: '',
      transactionDescription: 'SBIN319105870120',
      transactionReferenceId: '',
      transactionAt: new Date(2022, 7, 24, 11),
      transactionType: '',
      billInfoId: 0,
      repeatPaymentId: 0
    }

    let transaction6:TransactionModel={
      id: 2,
      accountId: 2,
      amount: -10000,
      balance: 105000,
      balanceType: '',
      category: '',
      categoryType: '',
      duplicateId: 1,
      duplicateConfidence: 0,
      generationType: '',
      matchingId: 0,
      matchingConfidence: 0,
      selfTransfer: false,
      transactionTimeSource: '',
      transactionDescription: 'SBIN3133105870120',
      transactionReferenceId: '',
      transactionAt: new Date(2022, 9, 24, 11),
      transactionType: '',
      billInfoId: 0,
      repeatPaymentId: 0
    }

    transactionList.push(transaction1,transaction2,transaction3,transaction4,transaction5,transaction6)
    let dbOperator:DBOperator = new TestDBOperator (null,100)
    const spyCrediTtansactions = jest.spyOn(dbOperator,'fetchAllCreditTransactions')
    const spyDeditTransactions = jest.spyOn(dbOperator,'fetchAllCreditTransactions')
    spyCrediTtansactions.mockImplementation(()=>new Promise((resolve)=>{resolve(transactionList)}))
    spyDeditTransactions.mockImplementation(()=>new Promise((resolve)=>{resolve(transactionList)}))
    const spyStoreRepeatPayment = jest.spyOn(dbOperator,'storeRepeatativePayment')
    spyStoreRepeatPayment.mockImplementation(()=> new Promise((resolve)=>{resolve(1)}))
    const spyUpdateTransation = jest.spyOn(dbOperator,'updateTransactionModelRepaymentId')
    spyUpdateTransation.mockImplementation()
    var result = classifyRepeatativePayments(dbOperator)
    expect(result).toBeDefined()
    expect(result["exemplars"]).toEqual([1,4])
    expect(result["clusters"]).toEqual([1,1,1,4,4,4])
  })
})

class TestDBOperator extends DBOperator{

  fetchSmsRegex(sender: string): Promise<Regex[]> {
    throw new Error('Method not implemented.')
  }
  storeSms(sms: SmsData): Promise<SmsModel> {
    throw new Error('Method not implemented.')
  }
  fetchSms(smsId: any): Promise<SmsModel> {
    throw new Error('Method not implemented.')
  }
  updateSmsModel(smsId: any, status: string): Promise<SmsModel> {
    throw new Error('Method not implemented.')
  }
  storeTransactionData(transactionRequest: TransactionRequest, smsId: any): Promise<number> {
    throw new Error('Method not implemented.')
  }
  updateTransactionModelRepaymentId(transactionModel: TransactionModel, repeatPaymentId: number): Promise<void> {
    throw new Error('Method not implemented.')
  }
  fetchAccountIdByAccountTypeAndNumberAndIssuer(accountType: string, accountNumber: string, issuer: string): Promise<number | undefined> {
    throw new Error('Method not implemented.')
  }
  createNewAccount(accountRequest: AccountRequest): Promise<number> {
    throw new Error('Method not implemented.')
  }
  storeAccountBalance(accountBalanceRequest: AccountBalanceRequest): Promise<number> {
    throw new Error('Method not implemented.')
  }
  storeCreditCard(creditCardRequest: CreditCardRequest): Promise<number> {
    throw new Error('Method not implemented.')
  }
  storeBillInfos(billInfo: BillInfosRequest): Promise<number> {
    throw new Error('Method not implemented.')
  }
  fetchBillByAccountId(accountId: number): Promise<number | undefined> {
    throw new Error('Method not implemented.')
  }
  createNewBill(billRequest: BillRequest): Promise<number> {
    throw new Error('Method not implemented.')
  }
  fetchLatestUnpaidBillInfoByAccountId(accountId: number): Promise<BillInfosModel | undefined> {
    throw new Error('Method not implemented.')
  }
  updateBillsInfo(billInfo: BillInfosRequest): Promise<number> {
    throw new Error('Method not implemented.')
  }
  fetchTransactionsByAccountId(accountId: number): Promise<number | undefined> {
    throw new Error('Method not implemented.')
  }
  fetchCardsByAccountId(accountId: number): Promise<number | undefined> {
    throw new Error('Method not implemented.')
  }
  fetchTransactionByAmountBetweenDates(amount: number, fromDate: Date, tillDate: Date): Promise<TransactionModel[]> {
    throw new Error('Method not implemented.')
  }
  fetchTransactionsByAmountAndAccountNumberBetweenDates(amount: number, accountNumber: string, fromDate: Date, tillDate: Date): Promise<TransactionModel[]> {
    throw new Error('Method not implemented.')
  }
  fetchAllCreditTransactions(): Promise<TransactionModel[]> {
    throw new Error('Method not implemented.')
  }
  fetchAllDebitTransactions(): Promise<TransactionModel[]> {
    throw new Error('Method not implemented.')
  }
  storeRepeatativePayment(repeatativePayment: RepeatativeTransactionRequest): Promise<number> {
    throw new Error('Method not implemented.')
  }
}