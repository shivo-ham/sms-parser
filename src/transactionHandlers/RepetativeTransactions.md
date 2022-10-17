# Repeating Transactions
Customers can have repetetive credit and debit transactions. 

## Nature of repetative transactions
1. Bill & CC Payments - Ignored as we capture bills
2. Loan EMI payments - We have not captured loans. When we do this will be taken care of
3. Income transactions - Salary, FD interest, rental incomes and other periodic transactions
4. Repeating transactions sent to the same sender ( based on transaction description ). we can also capture recepient details from transactions for some transactions. 
5. Subscriptions - can have different frequencies. 

We will implement in stages. 

### Stage 1 : Monthly repetative
1. Salary and other repetative incomes
2. Repetative expenses. 

