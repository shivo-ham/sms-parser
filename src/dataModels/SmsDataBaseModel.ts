export interface SmsDataBaseModel{
  _id: number // i dof sms in mobile database. Client only field
  address: string
  date_sent: string // sms sent date
  body: string // sms body
  original?: string // the cleaned sms that is needed for our parsing
  sim_imsi?: string
  date: string // date of rx of sms
}