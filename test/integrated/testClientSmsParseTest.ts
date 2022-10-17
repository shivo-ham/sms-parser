import { SmsData } from '../../src/dataModels/SmsData'
import { processSMS } from '../../src/smsProcessor/SmsParse'
import { createPool, createConnection } from 'mysql2/promise';
import { DBOperator } from '../../src/database/DBOperator';
import { AccountBalanceRequest } from '../../src/dataModels/AccountBalanceRequest';
import { AccountRequest } from '../../src/dataModels/AccountRequest';
import { Regex } from '../../src/dataModels/Regex';
import { SmsModel } from '../../src/dataModels/SmsModel';
import { TransactionRequest } from '../../src/dataModels/TransactionRequest';
import { BillInfosRequest } from '../../src/dataModels/BillInfosRequest';
import { BillRequest } from '../../src/dataModels/BillRequest';
import { CreditCardRequest } from '../../src/dataModels/CreditCardRequest';
import { readFile, utils } from 'xlsx'
import { BillInfosModel } from '../../src/dataModels/BillInfosModel';
import { parseDateTime } from '../../src/utils/DateUtil';


async function runSMSParseCLient() {
  // let testSms: SmsData = {
  //   _id: 1,
  //   address: "CBSSBI",
  //   date: "20211129",
  //   date_sent: "20211129",
  //   body: "Dear Customer Your A/C XXXXX936861 has a debit by transfer of Rs 752.00 on 14/12/21. Avl Bal Rs 2668.14.-SBI"

  // }

  let testSms: SmsData = {
    "_id": 1,
    "address": "KOTAKB",
    "date": "20211129",
    "date_sent": "20211129",
    "body": "Transaction of INR 10000 has been made on your Kotak Bank Credit Card ending xx8900 on 31-DEC-2021 at KhazanaJewellerCashFre. Available credit limit is Rs.52004.05. To report fraud or raise disputeClick https://bit.ly/33kCh5I"
  }
  let testConfig = {
    host: "localhost",
    user: "root",
    password: "password",
    database: "sms_service",
    port: 13306
  }
  console.log("testing sms")
  const file = readFile('/home/prannoysarkar/Downloads/all_sms_v2_trxn.xlsx')
  const sheets = file.SheetNames
  const connection = createPool(testConfig);
  for (let i = 0; i < sheets.length; i++) {
    let temp = utils.sheet_to_json(
      file.Sheets[file.SheetNames[i]])
    temp = temp.slice(0, 37000)
    // createModel(temp[0],connection) 
    for (const tmp of temp) {
      await createModel(tmp, connection)
    }
  }

  let dbOperator = new ClientTestDBOperator(connection, 100)
  processSMS(100, testSms, dbOperator)
}

class ClientTestDBOperator extends DBOperator {
  
  fetchAccountIdByAccountTypeAndNumberAndIssuer(accountType: string, accountNumber: string, issuer: string): Promise<number | undefined> {
    throw new Error('Method not implemented.');
  }

  async fetchTransactionsByAccountId(accountId: number): Promise<number | undefined> {
    console.log("Account account ID :" + accountId)
    const result = await this.query(`select id from sms_transactions where account_id=?`,
      [accountId])
    console.log("transaction Ids fetched: " + JSON.stringify(result))
    return new Promise((resolve, reject) => {
      if (result) {
        if (result.length > 0) {
          resolve(result[0])
        } else { resolve(undefined) }
      } else {
        resolve(undefined)
      }
    })
  }

  async fetchCardsByAccountId(accountId: number): Promise<number | undefined> {
    console.log("Cards account ID :" + accountId)
    const result = await this.query(`select id from cards where account_id=?`,
      [accountId])
    console.log("card Ids fetched: " + JSON.stringify(result))
    return new Promise((resolve, reject) => {
      if (result) {
        if (result.length > 0) {
          resolve(result[0])
        } else { resolve(undefined) }
      } else {
        resolve(undefined)
      }
    })
  }

  async fetchLatestUnpaidBillInfoByAccountId(accountId: number): Promise<BillInfosModel | undefined> {
    const result = await this.query('select * from bill_infos where payment_status is not null and payment_status!=? order by created_at DESC limit 1',
      ['PAID'])
    return new Promise((resolve, reject) => {
      if (result) {
        let billInfo: BillInfosModel = {
          id: result["id"],
          paymentAt: parseDateTime("YYYY-MM-DD",result["payment_at"],""),
          paymentStatus: result["payment_status"],
          paidAmount: result["payment_amount"],
          billedAmount: result["billed_amount"],
          minimumAmmount: result["minimum_account"],
          smsId: result["sms_id"],
          accountId: result["account_id"],
          generationAt: parseDateTime("YYYY-MM-DD", result["generation_at"],""),
          dueAt: parseDateTime("YYYY-MM-DD", result["due_at"],""),
        }
        resolve(billInfo)
      } else {
        resolve(undefined)
      }
    })
  }

  async updateBillsInfo(billInfo: BillInfosRequest): Promise<number> {
    const result = await this.query('update bills_info set account_id=?, sms_id=?, payment_status=?, minimum_amount =?, paid_amount=?, billed_amount=?, generation_at=?, due_at=?, payment_at=? where id = ? ',
      [billInfo.accountId,
      billInfo.smsId,
      billInfo.paymentStatus,
      billInfo.minimumAmount,
      billInfo.paidAmount,
      billInfo.billedAmount,
      billInfo.generationAt.toISOString().slice(0, 19).replace('T', ' '),
      billInfo.dueAt.toISOString().slice(0, 19).replace('T', ' '),
      billInfo.paymentAt.toISOString().slice(0, 19).replace('T', ' '),
      billInfo.id])

    return new Promise((resolve) => {
      if (result) {
        resolve(billInfo.id)
      }
    })
  }

  async fetchSmsRegex(sender: string): Promise<Regex[]> {
    const result = await this.query(`select * from sms_regexes where sms_sender=?`, [sender])
    // console.log("Result sms regexes fetched: " + JSON.stringify(result))
    return new Promise((resolve, reject) => {
      if (result) {
        let ans: Regex[] = []
        for (let i = 0; i < result.length; i++) {
          let regex: Regex = {
            id: result[i]["id"],
            smsSender: result[i]["sms_sender"],
            smsRegex: result[i]["sms_regex"],
            transactionType: result[i]["transaction_type"],
            dateFormats: result[i]["date_formats"],
            messageType: result[i]["message_type"],
            accountType: result[i]["account_type"],
            mc1: result[i]["mc1"],
            mc2: result[i]["mc2"],
            mc3: result[i]["mc3"],
            mc4: result[i]["mc4"],
            mc5: result[i]["mc5"],
            mc6: result[i]["mc6"],
            mc7: result[i]["mc7"],
            mc8: result[i]["mc8"],
            mc9: '',
            mc10: ''
          }
          ans.push(regex)
        }
        resolve(ans)
      }
      else {
        reject(console.log("Could not fetch Regexes"))
      }
    })
  }

  async storeSms(sms: SmsData): Promise<SmsModel> {
    console.log("sms data body  is :"+ sms.body)
    const result = await this.query('insert into  raw_messages (customer_id,sms_content,sms_from,sms_at) values(?,?,?,?)',
    [this.customerId, sms.body, sms.address, sms.date])
    return new Promise((resolve, reject) => {
      let smsModel: SmsModel = {
        id: result["insertId"],
        smsContent: sms.body || '',
        smsAt: sms.date || '',
        smsFrom: sms.address || '',
        smsStatus: '',
        customerId: 100,
        smsSentAt: ""
      }
      resolve(smsModel)
    })
  }

  async fetchSms(smsId: number): Promise<SmsModel> {
    const result = await this.query("select * from raw_messages where id =?", [smsId])
    let smsModel: SmsModel
    return new Promise((resolve) => {
      if (result && result.length > 0) {
        smsModel = {
          id: smsId,
          smsContent: result[0]["sms_content"],
          smsAt: result[0]["sms_at"],
          smsSentAt: result[0]["sms_at"],
          smsFrom: result[0]["sms_from"],
          smsStatus: result[0]["sms_status"],
          customerId: result[0]["customer_id"]
        }
      }
      resolve(smsModel)
    })
  }

  async updateSmsModel(smsId: any, status: string): Promise<SmsModel> {
    console.log("Updating SMSModel with status : "+status )
    await this.dbClient.query('update raw_messages set sms_status =? where id = ?', [status, Number(smsId)]);
    console.log("fetching sms of "+smsId)
    return this.fetchSms(smsId)
  }

  async storeTransactionData(transactionRequest: TransactionRequest, smsId: number): Promise<number> {
    console.log("Transaction Request amount is : " + JSON.stringify(transactionRequest))
    const params = [
    transactionRequest.accountId,
    transactionRequest.amount,
    transactionRequest.transactionType,
    transactionRequest.transactionDescription,
    transactionRequest.transactionReferenceNo,
    transactionRequest.transactionAt,
    transactionRequest.transactionType,
    transactionRequest.category,
    transactionRequest.categoryType,
    smsId,
    transactionRequest.accountBalance,
    transactionRequest.balanceType,
    transactionRequest.generationType
    ]
    console.log("Params trans request are : " + JSON.stringify(params))
    const result = await this.query(`insert into sms_transactions (account_id, amount, transaction_type, transaction_description,transaction_reference_id, transaction_at, transaction_time_source, category, category_type, sms_id, balance, balance_type, generation_type) values(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      params)
    console.log("Transaction created : " + JSON.stringify(result))
    return new Promise((resolve, reject) => {
      if (result) {
        resolve(result)
      }
      else {
        reject(console.log("Could not create transaction"))
      }
    })
  }
  async fetchAccountIdByAccountTypeAndNumber(accountType: string, accountNumber: string): Promise<number | undefined> {
    console.log("Account type and number ", accountType + " -" + accountNumber)
    const result = await this.query(`select id from accounts where customer_id=? and account_number=? and account_number=?`,
      [this.customerId, accountNumber, accountType])
    console.log("Account Id fetched: " + JSON.stringify(result))
    if (result) {
      return new Promise((resolve) => {
        if (result.length > 0) {
          resolve(result[0])
        }
        else {
          return resolve(undefined)
        }
      })
    } else {
      console.log("Could not fetch Accounts")
    }
  }

  async createNewAccount(accountRequest: AccountRequest): Promise<number> {
    const result = await this.query(`insert into accounts (customer_id, account_number, account_type, issuer_id, phone_number, upi_id) values (?,?,?,?,?,?)`,
      [this.customerId, accountRequest.accountNumber, accountRequest.accountType, accountRequest.smsFrom, null, null])
    console.log("Result of account created : " + JSON.stringify(result))
    return new Promise((resolve, reject) => {
      if (result) {
        resolve(result.insertId)
      }
      else {
        reject(console.log("Could not create Account"))
      }
    })
  }
  async storeAccountBalance(accountBalanceRequest: AccountBalanceRequest): Promise<number> {
    const result = await this.query(`insert into account_balances (account_id, balance_at,balance_amount) values (?,?,?)`,
      [accountBalanceRequest.accountId,
      accountBalanceRequest.balanceAt,
      accountBalanceRequest.balanceAmount])
    console.log("Result of account balance created : " + JSON.stringify(result))
    return new Promise((resolve, reject) => {
      if (result) {
        resolve(result)
      }
      else {
        reject(console.log("Could not create Account Balance"))
      }
    })
  }

  async storeCreditCard(creditCardRequest: CreditCardRequest): Promise<number> {
    const result = await this.query(`insert into cards (account_id , card_type, brand, card_network, total_credit_line, available_credit_line) values (?,?,?,?,?,?)`,
      [creditCardRequest.accountId,
      creditCardRequest.cardType,
      creditCardRequest.brand,
      creditCardRequest.cardNetwork,
      creditCardRequest.totalCreditLine,
      creditCardRequest.availableCreditLine,
      creditCardRequest.availableCreditAt,
      creditCardRequest.totalCreditAt
      ])
    console.log("Result of creating and storing credit card : " + JSON.stringify(result))
    return new Promise((resolve, reject) => {
      if (result) {
        resolve(result.insertId)
      }
      else {
        reject(console.log("Could not create Card"))
      }
    })
  }

  async storeBillInfos(billInfo: BillInfosRequest): Promise<number> {
    const result = await this.query(`insert into bill_infos (account_id , sms_id, payment_status, minimum_amount, paid_amount, billed_amount, generation_at, due_at, payment_at) values (?,?,?,?,?,?,?,?,?)`,
      [billInfo.accountId,
      billInfo.smsId,
      billInfo.paymentStatus,
      billInfo.minimumAmount,
      billInfo.paidAmount,
      billInfo.billedAmount,
      billInfo.generationAt.toISOString().slice(0, 19).replace('T', ' '),
      billInfo.dueAt.toISOString().slice(0, 19).replace('T', ' '),
      billInfo.paymentAt.toISOString().slice(0, 19).replace('T', ' ')
      ])
    console.log("Result of creating and storing Bill_Info deatils : " + JSON.stringify(result))
    return new Promise((resolve, reject) => {
      if (result) {
        resolve(result.insertId)
      }
      else {
        reject(console.log("Could not create Bill_info"))
      }
    })
  }

  async fetchBillByAccountId(accountId: number): Promise<number | undefined> {
    console.log("Account number :" + accountId)
    const result = await this.query(`select id from bills where account_id=?`,
      [accountId])
    console.log("Bill Id fetched: " + JSON.stringify(result))
    if (result) {
      return new Promise((resolve, reject) => {
        if (result.length > 0) {
          resolve(result[0])
        }
        else {
          return undefined
        }
      })
    } else return undefined

  }
  async createNewBill(billRequest: BillRequest): Promise<number> {
    const result = await this.query(`insert into bills (account_id , reccurence_cycle, generation_date, due_date) values (?,?,?,?)`,
      [billRequest.accountId,
      billRequest.recurrenceCycle,
      billRequest.generationDate,
      billRequest.dueDate
      ])
    console.log("Result of creating and storing a new Bill : " + JSON.stringify(result))
    return new Promise((resolve, reject) => {
      if (result) {
        resolve(result.insertId)
      }
      else {
        reject(console.log("Could not create new Bill"))
      }
    })
  }

  async query(sql: string, params: any) {
    const [results,] = await this.dbClient.execute(sql, params);
    return results;
  }

}
async function createModel(res: any, connection: any) {
  let smsData: SmsData = {
    _id: res["id"],
    address: res["address"],
    date_sent: "20220311",
    body: res["body"],
    date: "20220311"
  }
  let dbOperator = new ClientTestDBOperator(connection, res["customer_id"])
  await processSMS(res["customer_id"], smsData, dbOperator)
}

runSMSParseCLient()