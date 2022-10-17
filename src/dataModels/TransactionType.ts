export enum TransactionType{
  LOAN_STATEMENT = 'LOAN_STATEMENT', //Loan Statement
  LOAN_EMI_CONFIRMATION = 'LOAN_EMI_CONFIRMATION', //Loan Confirmation
  LOAN_OPEN = 'LOAN_OPEN', //Loan Opening
  LOAN_CLOSE = 'LOAN_CLOSE', //Loan Close
  LOAN_EMI_REMINDER = 'LOAN_EMI_REMINDER', //Loan Repayment reminder
  LOAN_AUTO_DEBIT_BOUNCE = 'LOAN_AUTO_DEBIT_BOUNCE', //Loan Auto debit bounce
  CC_BALANCE = 'CC_BALANCE', //Credit card balance only
  CC_TRANSACTION = 'CC_TRANSACTION', //Credit card transaction
  CC_TRANSACTION_INFORMATION = 'CC_TRANSACTION_INFORMATION', //Credit card Transaction with additional user information
  CC_STATEMENT = 'CC_STATEMENT', //Credit card Bill statement
  CC_REMINDER = 'CC_REMINDER', //Credit card repaymenrtreminder
  CC_LOAN = 'CC_LOAN', //Credit card - Loan Booked
  CC_LOAN_EMI = 'CC_LOAN_EMI', //Credit Card- EMI billed on loan
  DC_TRANSACTION = 'DC_TRANSACTION', //Debit Card Transaction
  DC_TRANSACTION_BALANCE = 'DC_TRANSACTION_BALANCE', //Debit Card Transaction with balance
  DC_ATM = 'DC_ATM', //Debit Card ATM cash withdrawal
  BILL_GENERATION = 'BILL_GENERATION', //Bill Generation
  BILL_INFORMATION = 'BILL_INFORMATION', //Bill Information
  BILL_CONFIRMATION = 'BILL_CONFIRMATION', //Bill Confirmation
  BILL_TXN_CONFIRMATION = 'BILL_TXN_CONFIRMATION', //Bill Txn confirmation
  CASA_BALANCE = 'CASA_BALANCE', //CASA Balance
  CASA_CHECK_BOUNCE = 'CASA_CHECK_BOUNCE', //Casa check bounce
  CASA_AUTO_DEBIT_REJECT = 'CASA_AUTO_DEBIT_REJECT', //Casa Auto debit reject
  CASA_BELOW_MAB = 'CASA_BELOW_MAB', //Casa below MAB
  UPI = 'UPI', //CASA UPI
  NEFT = 'NEFT', //CASA Neft
  RTGS = 'RTGS', //Casa RTGS
  TRANSFER = 'TRANSFER', //CASA Transfers
  WALLET_LOAD = 'WALLET_LOAD', //Wallet Load
  CC_BILL_PAYMENT = 'CC_BILL_PAYMENT', //Credit card Payment
  IMPS = 'IMPS', //CASA Imps
  CC_STANDING_INSTRUCTION = 'CC_STANDING_INSTRUCTION', //Credit card standing instruction
  NACH = 'NACH', //CASA eNACH
  BILL_IMMEDIATE = 'BILL_IMMEDIATE', //Bill Immediately
  BILL_DUE_TODAY = 'BILL_DUE_TODAY', //Bill Due Today
  SALARY = 'SALARY',
  CASH_DEPOSIT = 'CASH_DEPOSIT',
  FEES_CHARGES = 'FEES_CHARGES',
  ATM_WITHDRAWAL = 'ATM_WITHDRAWAL',
  CHECK = 'CHECK',
  MERCHANT = 'MERCHANT',
  NETBANKING = 'NETBANKING',
  LOAN_EMI='LOAN_EMI',
  CASA_FD='CASA_FD',
  CASA_RD='CASA_RD',
  ECS='ECS',
  CC_AUTOPAY='CC_AUTOPAY',
  DC_AUTOPAY='DC_AUTOPAY',
  RECHARGE='RECHARGE',
  BILL_PAYMENT='BILL_PAYMENT'


}

export const BankingTransferTransactions = [
  TransactionType.UPI.toString(),
  TransactionType.NEFT.toString(),
  TransactionType.RTGS.toString(),
  TransactionType.TRANSFER.toString(),
  TransactionType.IMPS.toString(),
  TransactionType.SALARY.toString(),
  TransactionType.NACH.toString(),
  TransactionType.NETBANKING.toString(),
  TransactionType.CHECK.toString()
]