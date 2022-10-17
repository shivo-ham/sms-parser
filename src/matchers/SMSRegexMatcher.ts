import { Regex } from "../dataModels/Regex"
import { SmsModel } from "../dataModels/SmsModel"
import { parseDateTime } from "../utils/DateUtil"
import { cleanAmount, formatAccountNumbers } from "../utils/StringUtil"

export class SMSRegexMatcher {
  smsModel: SmsModel
  regexList: Regex[]

  constructor(smsModel: SmsModel, regexList: Regex[]) {
    this.smsModel = smsModel,
      this.regexList = regexList
  }

  /**
   * 
   * @param smsContent 
   * @param regexList 
   * @returns 
   */
  parseSMSContentWithRegex(): any {
    const { smsContent } = this.smsModel
    let matchedGroups = []
    for (let regExp of this.regexList) {
      let regExObj = new RegExp(regExp.smsRegex)
      if (regExObj.test(smsContent)) {
        matchedGroups = regExObj.exec(smsContent)
        return this.generateRegexJson(this.smsModel, matchedGroups, regExp)
      }
    }
    return {}
  }
  // FIXME: For amount fields, it needs to be parsed. Remove commas and parseFloat. 
  private generateRegexJson(smsModel: SmsModel, matchedGroups: string[], regex: Regex): any {
    let jsonResult = {}
    // trim extra spaces and tabs etc.
    // str.replace(/\.+$/, ""); a.replace(/^\./, "")

    matchedGroups = matchedGroups.map(mg => mg.trim().replace(/\.+$/, "").replace(/^\./, ""))
    jsonResult[regex.mc1] = matchedGroups[1]
    jsonResult[regex.mc2] = matchedGroups[2]
    jsonResult[regex.mc3] = matchedGroups[3]
    jsonResult[regex.mc4] = matchedGroups[4]
    jsonResult[regex.mc5] = matchedGroups[5]
    jsonResult[regex.mc6] = matchedGroups[6]
    jsonResult[regex.mc7] = matchedGroups[7]
    jsonResult[regex.mc8] = matchedGroups[8]
    jsonResult[regex.mc9] = matchedGroups[9]
    jsonResult[regex.mc10] = matchedGroups[10]
    jsonResult['account_type'] = regex.accountType || null
    jsonResult['message_type'] = regex.messageType || null
    jsonResult['transaction_type'] = regex.transactionType || null
    jsonResult['date_formats'] = regex.dateFormats || null
    delete jsonResult[""]
    // Object.keys(jsonResult).forEach(ky => {
    //   if(jsonResult[ky]) {
    //     jsonResult[ky] = jsonResult[ky].replace(/\.+$/, "").replace(/^\./, "")
    //   }
    // })
    // return jsonResult
    return this.reformatJsonDataForAccount(jsonResult,smsModel)
  }

  // private setTransactionDate(smsModel: SmsModel, jsonResult: any) {
  //   const { smsAt, smsSentAt } = smsModel
  //   let smsDate = smsSentAt || smsAt
  //   jsonResult['transaction_date'] = parseDateTime(jsonResult['date_formats'], jsonResult['transaction_date'], smsDate) || new Date()
  //   return jsonResult
  // }

  private reformatJsonDataForAccount(jsonResult:any, sms:SmsModel):any {
    const { smsAt, smsSentAt } = sms
    let smsDate = smsSentAt || smsAt
    jsonResult['transaction_date'] = smsDate // FIXME: Put me back parseDateTime(jsonResult['date_formats'], jsonResult['transaction_date'], smsDate) || new Date()
    jsonResult["transaction_reference_no"] = jsonResult["transaction_reference_no"] || null
    jsonResult["cc_outstanding_balance"] = cleanAmount(jsonResult["cc_outstanding_balance"]) || null
    jsonResult["cc_min_amt_due"] = cleanAmount(jsonResult["cc_min_amt_due"]) || null
    jsonResult["cc_total_amt_due"] = cleanAmount(jsonResult["cc_total_amt_due"]) || null
    jsonResult["bill_generation_date"] = parseDateTime(jsonResult["date_formats"], jsonResult["bill_generation_date"], sms.smsSentAt) || null
    jsonResult["transaction_amount"] = cleanAmount(jsonResult["transaction_amount"]) || null
    jsonResult["transaction_description"] = jsonResult["transaction_description"] || null
    jsonResult["cc_available_limit"] = cleanAmount(jsonResult["cc_available_limt"]) || null
    jsonResult["cc_brand_name"] = jsonResult["cc_brand_name"] || null
    jsonResult["cc_pmt_due_date"] = parseDateTime(jsonResult["date_formats"], jsonResult["cc_pmt_due_date"], sms.smsSentAt) || sms.smsSentAt
    jsonResult["sms_id"] = sms.id
    jsonResult["sms_from"] = sms.smsFrom
    const { accountNumber, actualAccountNumber } = formatAccountNumbers(jsonResult["account_number"])
    jsonResult["account_number"] = accountNumber
    jsonResult["actual_account_number"] = actualAccountNumber
    jsonResult["bill_amount"] = cleanAmount(jsonResult["bill_amount"]) || null
    jsonResult["bill_due_date"] = parseDateTime(jsonResult["date_formats"],jsonResult["bill_due_date"], sms.smsSentAt) || null
    jsonResult['available_balance'] = cleanAmount(jsonResult['available_balance']) || null
    jsonResult['upi_number'] = jsonResult['upi_number'] || null
    return jsonResult
  }
}