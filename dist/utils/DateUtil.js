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
exports.findClosestDate = exports.isHourMinuteSecondPresent = exports.getTimeWithOffsetInMinutes = exports.strictDateParsing = exports.parseDateTime = void 0;
// export function parseRawSMSDate(dateTime:string): Date{
//   return  moment(dateTime,'YYYY-MM-DD hh:mm:ss').toDate()
// }
const dayjs = require("dayjs");
dayjs.locale('en-in');
// dayjs.extend(customParseFormat)
function parseDateTime(dateFormats, dateString, smsSentAt) {
    // return dayjs(smsSentAt).toDate()
    console.log("Date Formats are :" + JSON.stringify(dateFormats));
    let resultDate = dayjs(smsSentAt).toDate();
    if (dateString) {
        let cleanDateString = dateString === null || dateString === void 0 ? void 0 : dateString.trim().replace(/at /g, '');
        if (dateFormats) {
            let dateFormatArray = dateFormats.split(',');
            for (let dateFormat of dateFormatArray) {
                console.log("Date Formats Array is :" + JSON.stringify(dateFormatArray));
                console.log("Date Format before is :" + dateFormat);
                dateFormat = dateFormat.trim().replace(/at /g, '');
                console.log("Date Format is :" + dateFormat);
                resultDate = strictDateParsing(cleanDateString, dateFormat, smsSentAt);
                if (resultDate)
                    break;
            }
        }
    }
    return resultDate;
}
exports.parseDateTime = parseDateTime;
function strictDateParsing(dateString, format, smsDate) {
    console.log("Inside Strict Date Parsing format: " + format + " for date string: " + dateString);
    // dayjs.extend(advanced)
    let result = dayjs(dateString, format, 'en-in');
    console.log("Result is : " + result);
    let defaultResult = dayjs(smsDate).toDate();
    if (result) {
        console.log("Valid Date format: " + format + " for date string: " + dateString + " and result is :" + JSON.stringify(result));
        console.log("Hour, minute and seconds are : " + result.hour() + " " + result.minute() + " " + result.second());
        // Formats that dont have year
        if (format.indexOf('Y') === -1) {
            console.log("Result in index of Y is: " + result.toDate());
            const thisYear = dayjs(smsDate).year();
            result = result.year(thisYear);
        }
        console.log("Debugging before isHourMinuteSecondPresent " + JSON.stringify(result));
        if (isHourMinuteSecondPresent(result)) {
            console.log("Hours minutes and seconds all are not zero");
            console.log("This result is " + JSON.stringify(result.toDate()));
            return result.toDate();
        }
        else {
            console.log("Default result is :" + JSON.stringify(defaultResult));
            return defaultResult;
        }
    }
    else {
        console.log("Invalid Date format: " + format + " for date string: " + dateString);
        console.log("SMS sent at " + smsDate);
        if (smsDate) {
            return defaultResult;
        }
        return undefined;
    }
}
exports.strictDateParsing = strictDateParsing;
function getTimeWithOffsetInMinutes(baseTime, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = new Date(baseTime.getTime());
        result.setMinutes(baseTime.getMinutes() - offset);
        console.log("Basetime is " + JSON.stringify(baseTime) + " Result date is : " + JSON.stringify(result));
        return result;
    });
}
exports.getTimeWithOffsetInMinutes = getTimeWithOffsetInMinutes;
function isHourMinuteSecondPresent(date) {
    console.log("Inside isHourMinuteSecondPresent  - " + date.hour() + " " + date.minute() + " " + date.second());
    return !(date.second() === 0 && date.minute() == 0 && date.hour() == 0);
}
exports.isHourMinuteSecondPresent = isHourMinuteSecondPresent;
function findClosestDate(arr, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let timeDiff = Number.MAX_VALUE;
        let index = 0;
        const d1 = dayjs(target);
        for (let i = 0; i < arr.length; i++) {
            const d2 = dayjs(arr[i]);
            let diff = d1.diff(d2);
            if (diff < timeDiff) {
                timeDiff = diff;
                index = i;
            }
        }
        return index;
    });
}
exports.findClosestDate = findClosestDate;
