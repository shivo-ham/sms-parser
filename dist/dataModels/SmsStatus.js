"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsStatus = void 0;
var SmsStatus;
(function (SmsStatus) {
    SmsStatus["TO_BE_PARSED_LATER"] = "TO_BE_PARSED_LATER";
    SmsStatus["TO_BE_PARSED"] = "TO_BE_PARSED";
    SmsStatus["PARSED_ON_MOBILE"] = "PARSED_ON_MOBILE";
    SmsStatus["PARSED_ON_SERVER"] = "PARSED_ON_SERVER";
    SmsStatus["FAILED_ON_CLIENT"] = "FAILED_ON_CLIENT";
    SmsStatus["FAILED_ON_SERVER"] = "FAILED_ON_SERVER";
    SmsStatus["PROCESS_NEXT_DAY"] = "PROCESS_NEXT_DAY";
    SmsStatus["PARSE_ON_USER_INPUT"] = "PARSE_ON_USER_INPUT";
    SmsStatus["NO_REGEX_AVAILABLE"] = "NO_REGEX_AVAILABLE";
})(SmsStatus = exports.SmsStatus || (exports.SmsStatus = {}));
