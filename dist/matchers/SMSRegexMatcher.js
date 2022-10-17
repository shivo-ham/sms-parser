"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSRegexMatcher = void 0;
const DateUtil_1 = require("../utils/DateUtil");
const StringUtil_1 = require("../utils/StringUtil");
class SMSRegexMatcher {
    constructor(smsModel, regexList) {
        this.smsModel = smsModel,
            this.regexList = regexList;
    }
    /**
     *
     * @param smsContent
     * @param regexList
     * @returns
     */
    parseSMSContentWithRegex() {
        const { smsContent } = this.smsModel;
        let matchedGroups = [];
        for (let regExp of this.regexList) {
            let regExObj = new RegExp(regExp.smsRegex);
            if (regExObj.test(smsContent)) {
                matchedGroups = regExObj.exec(smsContent);
                return this.generateRegexJson(this.smsModel, matchedGroups, regExp);
            }
        }
        return {};
    }
    // FIXME: For amount fields, it needs to be parsed. Remove commas and parseFloat. 
    generateRegexJson(smsModel, matchedGroups, regex) {
        let jsonResult = {};
        // trim extra spaces and tabs etc.
        // str.replace(/\.+$/, ""); a.replace(/^\./, "")
        matchedGroups = matchedGroups.map(mg => mg.trim().replace(/\.+$/, "").replace(/^\./, ""));
        jsonResult[regex.mc1] = matchedGroups[1];
        jsonResult[regex.mc2] = matchedGroups[2];
        jsonResult[regex.mc3] = matchedGroups[3];
        jsonResult[regex.mc4] = matchedGroups[4];
        jsonResult[regex.mc5] = matchedGroups[5];
        jsonResult[regex.mc6] = matchedGroups[6];
        jsonResult[regex.mc7] = matchedGroups[7];
        jsonResult[regex.mc8] = matchedGroups[8];
        jsonResult[regex.mc9] = matchedGroups[9];
        jsonResult[regex.mc10] = matchedGroups[10];
        jsonResult['account_type'] = regex.accountType || null;
        jsonResult['message_type'] = regex.messageType || null;
        jsonResult['transaction_type'] = regex.transactionType || null;
        jsonResult['date_formats'] = regex.dateFormats || null;
        delete jsonResult[""];
        // Object.keys(jsonResult).forEach(ky => {
        //   if(jsonResult[ky]) {
        //     jsonResult[ky] = jsonResult[ky].replace(/\.+$/, "").replace(/^\./, "")
        //   }
        // })
        // return jsonResult
        return this.reformatJsonDataForAccount(jsonResult, smsModel);
    }
    // private setTransactionDate(smsModel: SmsModel, jsonResult: any) {
    //   const { smsAt, smsSentAt } = smsModel
    //   let smsDate = smsSentAt || smsAt
    //   jsonResult['transaction_date'] = parseDateTime(jsonResult['date_formats'], jsonResult['transaction_date'], smsDate) || new Date()
    //   return jsonResult
    // }
    reformatJsonDataForAccount(jsonResult, sms) {
        const { smsAt, smsSentAt } = sms;
        let smsDate = smsSentAt || smsAt;
        jsonResult['transaction_date'] = smsDate; // FIXME: Put me back parseDateTime(jsonResult['date_formats'], jsonResult['transaction_date'], smsDate) || new Date()
        jsonResult["transaction_reference_no"] = jsonResult["transaction_reference_no"] || null;
        jsonResult["cc_outstanding_balance"] = (0, StringUtil_1.cleanAmount)(jsonResult["cc_outstanding_balance"]) || null;
        jsonResult["cc_min_amt_due"] = (0, StringUtil_1.cleanAmount)(jsonResult["cc_min_amt_due"]) || null;
        jsonResult["cc_total_amt_due"] = (0, StringUtil_1.cleanAmount)(jsonResult["cc_total_amt_due"]) || null;
        jsonResult["bill_generation_date"] = (0, DateUtil_1.parseDateTime)(jsonResult["date_formats"], jsonResult["bill_generation_date"], sms.smsSentAt) || null;
        jsonResult["transaction_amount"] = (0, StringUtil_1.cleanAmount)(jsonResult["transaction_amount"]) || null;
        jsonResult["transaction_description"] = jsonResult["transaction_description"] || null;
        jsonResult["cc_available_limit"] = (0, StringUtil_1.cleanAmount)(jsonResult["cc_available_limt"]) || null;
        jsonResult["cc_brand_name"] = jsonResult["cc_brand_name"] || null;
        jsonResult["cc_pmt_due_date"] = (0, DateUtil_1.parseDateTime)(jsonResult["date_formats"], jsonResult["cc_pmt_due_date"], sms.smsSentAt) || sms.smsSentAt;
        jsonResult["sms_id"] = sms.id;
        jsonResult["sms_from"] = sms.smsFrom;
        const { accountNumber, actualAccountNumber } = (0, StringUtil_1.formatAccountNumbers)(jsonResult["account_number"]);
        jsonResult["account_number"] = accountNumber;
        jsonResult["actual_account_number"] = actualAccountNumber;
        jsonResult["bill_amount"] = (0, StringUtil_1.cleanAmount)(jsonResult["bill_amount"]) || null;
        jsonResult["bill_due_date"] = (0, DateUtil_1.parseDateTime)(jsonResult["date_formats"], jsonResult["bill_due_date"], sms.smsSentAt) || null;
        jsonResult['available_balance'] = (0, StringUtil_1.cleanAmount)(jsonResult['available_balance']) || null;
        jsonResult['upi_number'] = jsonResult['upi_number'] || null;
        return jsonResult;
    }
}
exports.SMSRegexMatcher = SMSRegexMatcher;
