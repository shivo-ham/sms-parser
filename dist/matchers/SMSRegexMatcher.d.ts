import { Regex } from "../dataModels/Regex";
import { SmsModel } from "../dataModels/SmsModel";
export declare class SMSRegexMatcher {
    smsModel: SmsModel;
    regexList: Regex[];
    constructor(smsModel: SmsModel, regexList: Regex[]);
    /**
     *
     * @param smsContent
     * @param regexList
     * @returns
     */
    parseSMSContentWithRegex(): any;
    private generateRegexJson;
    private reformatJsonDataForAccount;
}
