"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumFromStringValue = exports.stringSimilarityScore = exports.formatAccountNumbers = exports.cleanAmount = exports.cleanSmsAddress = exports.cleanSmsContent = void 0;
const string_similarity_1 = require("string-similarity");
/**
 * Method to clean up sms body
 * @param body string raw sms body
 * @returns cleaned sms content
 */
function cleanSmsContent(body) {
    return body.replace(/\(|\)|,/g, '')
        .replace(/[\t\n\r]/gm, ' ')
        .replace(/  +/g, ' ')
        .replace(/'/g, '')
        .replace(/"/g, '')
        .split(' ')
        .join(' ');
}
exports.cleanSmsContent = cleanSmsContent;
function cleanSmsAddress(address) {
    var _a;
    console.log("customer ID is :" + address);
    if (address) {
        if (address.indexOf('-') == -1) {
            let addressTrim = address.trim().toUpperCase();
            if (addressTrim.length >= 8) {
                addressTrim = addressTrim.slice(2);
            }
            return addressTrim;
        }
        else {
            return (_a = address.split('-')[1]) === null || _a === void 0 ? void 0 : _a.trim().toUpperCase();
        }
    }
    return null;
}
exports.cleanSmsAddress = cleanSmsAddress;
function cleanAmount(amount) {
    let result = null;
    if (amount && amount !== null) {
        result = Number(amount.replace(/,/g, '').replace(/\s/g, ''));
    }
    return result;
}
exports.cleanAmount = cleanAmount;
function formatAccountNumbers(accountNumber) {
    let actualAccountNumber = null;
    if (accountNumber === null || typeof accountNumber === 'undefined') {
        return { accountNumber: accountNumber, actualAccountNumber: actualAccountNumber };
    }
    if (isFullAccountNumber(accountNumber)) {
        actualAccountNumber = accountNumber;
    }
    accountNumber = trimAccountNumber(accountNumber);
    return { accountNumber: accountNumber, actualAccountNumber: actualAccountNumber };
}
exports.formatAccountNumbers = formatAccountNumbers;
function stringSimilarityScore(s1, s2) {
    let bestMatch = (0, string_similarity_1.findBestMatch)(s1, s2);
    // console.log("Best Match is - " + JSON.stringify(bestMatch))
    let rating = bestMatch.bestMatch.rating;
    let bestMatchIndex = bestMatch.bestMatchIndex;
    // console.log("Similarity rating - "+rating + " and best match index is : "+bestMatchIndex)
    if (rating)
        return { rating: rating * 100, index: bestMatchIndex };
    return { rating: 0, index: -1 };
}
exports.stringSimilarityScore = stringSimilarityScore;
function enumFromStringValue(enm, value) {
    let isEnum = Object.values(enm).includes(value);
    // ? value as unknown as T
    // : undefined;
    if (isEnum)
        return value;
    else {
        console.error(`Could create enum value: ${value}`);
        return undefined;
    }
}
exports.enumFromStringValue = enumFromStringValue;
function isFullAccountNumber(accountNo) {
    const specialCharacters = ['x', '*'];
    return specialCharacters.every(sc => accountNo.toLowerCase().indexOf(sc) === -1);
}
function trimAccountNumber(accountNumber) {
    let last4 = accountNumber.replace(/\*/g, 'X').toUpperCase().slice(-4);
    return last4.padStart(6, 'X');
}
