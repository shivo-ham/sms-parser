"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBatchSms = exports.processSMS = void 0;
const SmsStatus_1 = require("../dataModels/SmsStatus");
const SMSRegexMatcher_1 = require("../matchers/SMSRegexMatcher");
// import {  } from "../utils/StringUtil"
const AccountCreator_1 = require("./AccountCreator");
const StringUtil_1 = require("../utils/StringUtil");
let isClient = false;
/**
 * This method can be used by both server and client side, the sms data should confirm
 * to SmsData for client side whereas SmsModel for server side. Apart from this DBoperator
 * interface should be implemented with respective query language(only SQL) of your choice
 *
 * @param customerId integeral value customer id
 * @param sms SMS Object that is captured on client device side or SMS model on server side
 * @param dbOperator instance of DBOperator class to be implemented by code using this function
 */
function processSMS(customerId, sms, dbOperator) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("sms input is : " + JSON.stringify(sms));
        if (sms['address'] && sms['body']) {
            console.log("sms in if loop is : " + JSON.stringify(sms));
            // console.log("Storing client sms to db for sms :"+JSON.stringify(sms))
            let smsData = sms;
            smsData.address = (0, StringUtil_1.cleanSmsAddress)(smsData.address);
            smsData.original = smsData.body;
            smsData.body = (0, StringUtil_1.cleanSmsContent)(smsData.body);
            const stringRegexp = /[a-zA-Z]/g;
            isClient = true;
            if (stringRegexp.test(smsData.address)) {
                smsData.status = SmsStatus_1.SmsStatus.TO_BE_PARSED.valueOf();
                //Initialise with TO_BE_PARSED status
                try {
                    let smsModel = yield dbOperator.storeSms(smsData);
                    yield parseSms(smsModel, customerId, dbOperator);
                }
                catch (e) {
                    console.error(`Could not store the smsData: ${JSON.stringify(smsData)}, due to : ${e}`);
                }
            }
        }
        else {
            throw new Error("sms input format not recognized");
        }
    });
}
exports.processSMS = processSMS;
/**
 *
 * @param smsModel SmsModel a entity in raw_message table
 * @param customerId integral customer id
 * @param dbOperator dbOperator based on client using this library
 */
function parseSms(smsModel, customerId, dbOperator) {
    return __awaiter(this, void 0, void 0, function* () {
        let regexList;
        try {
            regexList = yield dbOperator.fetchSmsRegex(smsModel.smsFrom);
        }
        catch (e) {
            console.error(`Could not fetch Regex for smsID:${smsModel.id} with address: ${smsModel.smsFrom}`);
        }
        if (regexList.length == 0) {
            try {
                yield dbOperator.updateSmsModel(smsModel.id, SmsStatus_1.SmsStatus.NO_REGEX_AVAILABLE);
            }
            catch (e) {
                console.error(`Could not update SMS Model for smsId ${smsModel.id}`);
            }
        }
        else {
            let parsedSMSJson = new SMSRegexMatcher_1.SMSRegexMatcher(smsModel, regexList).parseSMSContentWithRegex();
            yield processingAccount(customerId, parsedSMSJson, dbOperator, smsModel);
        }
    });
}
/**
 * To be Implemented if we need to ingest batch sms, performance of queries can be improved
 * @param batchSms array of SmsData
 */
function parseBatchSms(batchSms) {
    console.log("parsing batch sms");
}
exports.parseBatchSms = parseBatchSms;
function processingAccount(customerId, parsedSMSJson, dbOperator, smsModel) {
    return __awaiter(this, void 0, void 0, function* () {
        let accountType = parsedSMSJson['account_type'];
        try {
            if (accountType) {
                let account = AccountCreator_1.AccountCreator.createAccount(accountType);
                if (account) {
                    if (parsedSMSJson["account_number"]) {
                        account.processSms(customerId, parsedSMSJson, dbOperator, smsModel);
                        if (isClient) {
                            yield dbOperator.updateSmsModel(smsModel.id, SmsStatus_1.SmsStatus.PARSED_ON_MOBILE.valueOf());
                        }
                        else {
                            yield dbOperator.updateSmsModel(smsModel.id, SmsStatus_1.SmsStatus.PARSED_ON_SERVER.valueOf());
                        }
                    }
                }
                else {
                    yield dbOperator.updateSmsModel(smsModel.id, SmsStatus_1.SmsStatus.TO_BE_PARSED.valueOf());
                }
            }
            else {
                if (isClient) {
                    yield dbOperator.updateSmsModel(smsModel.id, SmsStatus_1.SmsStatus.FAILED_ON_CLIENT);
                }
                else {
                    yield dbOperator.updateSmsModel(smsModel.id, SmsStatus_1.SmsStatus.FAILED_ON_SERVER);
                }
            }
        }
        catch (e) {
            console.error(`Could not update SMS Model for smsId ${smsModel.id}`);
        }
    });
}
