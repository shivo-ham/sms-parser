import { DBOperator } from "../database/DBOperator"
import { SmsData } from "../dataModels/SmsData"
import { SmsStatus } from "../dataModels/SmsStatus"
import { SmsDataBaseModel } from "../dataModels/SmsDataBaseModel"
import { SmsModel } from "../dataModels/SmsModel"
import { SMSRegexMatcher } from "../matchers/SMSRegexMatcher"
// import {  } from "../utils/StringUtil"
import { AccountCreator } from "./AccountCreator"
import { cleanSmsAddress, cleanSmsContent } from "../utils/StringUtil"
import { Regex } from "../dataModels/Regex"

let isClient = false
/**
 * This method can be used by both server and client side, the sms data should confirm 
 * to SmsData for client side whereas SmsModel for server side. Apart from this DBoperator 
 * interface should be implemented with respective query language(only SQL) of your choice
 * 
 * @param customerId integeral value customer id 
 * @param sms SMS Object that is captured on client device side or SMS model on server side
 * @param dbOperator instance of DBOperator class to be implemented by code using this function
 */
export async function processSMS(customerId: number, sms: SmsDataBaseModel, dbOperator: DBOperator) {
  console.log("sms input is : " + JSON.stringify(sms))
  if (sms['address'] && sms['body']) {
    console.log("sms in if loop is : " + JSON.stringify(sms))
    // console.log("Storing client sms to db for sms :"+JSON.stringify(sms))
    let smsData: SmsData = sms as SmsData;
    smsData.address = cleanSmsAddress(smsData.address)
    smsData.original = smsData.body
    smsData.body = cleanSmsContent(smsData.body)
    const stringRegexp = /[a-zA-Z]/g;
    isClient = true
    if (stringRegexp.test(smsData.address)) {
      smsData.status = SmsStatus.TO_BE_PARSED.valueOf()
      //Initialise with TO_BE_PARSED status
      try {
        let smsModel = await dbOperator.storeSms(smsData)
        await parseSms(smsModel, customerId, dbOperator)
      } catch (e) {
        console.error(`Could not store the smsData: ${JSON.stringify(smsData)}, due to : ${e}`)
      }
    }
  } else {
    throw new Error("sms input format not recognized")
  }
}

/**
 * 
 * @param smsModel SmsModel a entity in raw_message table
 * @param customerId integral customer id
 * @param dbOperator dbOperator based on client using this library
 */
async function parseSms(smsModel: SmsModel, customerId: number, dbOperator: DBOperator) {
  let regexList: Regex[]
  try {
    regexList = await dbOperator.fetchSmsRegex(smsModel.smsFrom)
  } catch (e) {
    console.error(`Could not fetch Regex for smsID:${smsModel.id} with address: ${smsModel.smsFrom}`)
  }
  if (regexList.length == 0) {
    try {
      await dbOperator.updateSmsModel(smsModel.id, SmsStatus.NO_REGEX_AVAILABLE)
    } catch (e) {
      console.error(`Could not update SMS Model for smsId ${smsModel.id}`)
    }
  } else {
    let parsedSMSJson = new SMSRegexMatcher(smsModel, regexList).parseSMSContentWithRegex()
    await processingAccount(customerId, parsedSMSJson, dbOperator, smsModel)
  }
}


/**
 * To be Implemented if we need to ingest batch sms, performance of queries can be improved
 * @param batchSms array of SmsData
 */
export function parseBatchSms(batchSms: SmsData[]) {
  console.log("parsing batch sms")
}


async function processingAccount(customerId: number,
  parsedSMSJson: any,
  dbOperator: DBOperator,
  smsModel: SmsModel) {
  let accountType = parsedSMSJson['account_type']
  try {
    if (accountType) {
      let account = AccountCreator.createAccount(accountType)
      if (account) {
        if (parsedSMSJson["account_number"]) {
          account.processSms(customerId, parsedSMSJson, dbOperator, smsModel)
          if (isClient) {
            await dbOperator.updateSmsModel(smsModel.id, SmsStatus.PARSED_ON_MOBILE.valueOf())
          }
          else {
            await dbOperator.updateSmsModel(smsModel.id, SmsStatus.PARSED_ON_SERVER.valueOf())
          }
        }
      } else {
        await dbOperator.updateSmsModel(smsModel.id, SmsStatus.TO_BE_PARSED.valueOf())

      }
    } else {
      if (isClient) {
        await dbOperator.updateSmsModel(smsModel.id, SmsStatus.FAILED_ON_CLIENT)

      }
      else {
        await dbOperator.updateSmsModel(smsModel.id, SmsStatus.FAILED_ON_SERVER)

      }
    }
  } catch (e) {
    console.error(`Could not update SMS Model for smsId ${smsModel.id}`)
  }
}