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
exports.classifyRepeatativePayments = exports.createRepeatTransactionCluster = void 0;
const StringUtil_1 = require("../utils/StringUtil");
const ap = require("affinity-propagation");
const dayjs = require("dayjs");
const RecurrenceType_1 = require("../dataModels/RecurrenceType");
function createRepeatTransactionCluster(transactionModels) {
    let size = transactionModels.length;
    let transactionDayList = transactionModels.map(tr => { var _a; return (_a = tr.transactionAt) === null || _a === void 0 ? void 0 : _a.getDate(); });
    let maxAmount = Math.max(...transactionModels.map(tr => tr.amount));
    let transactionScaledAmount = transactionModels.map(tr => 100.0 * (tr.amount) / maxAmount);
    console.log("Scaled Amount is : " + JSON.stringify(transactionScaledAmount));
    let transactionDescription = transactionModels.map(tr => tr.transactionDescription.replace(/[0-9]/g, "X").toLowerCase());
    console.log("Transaction description is : " + JSON.stringify(transactionDescription));
    let similarityDay = Array.from(Array(size), _ => Array(size).fill(0));
    let similarityTransDescription = Array.from(Array(size), _ => Array(size).fill(0));
    let similarityAmount = Array.from(Array(size), _ => Array(size).fill(0));
    let similarity = Array.from(Array(size), _ => Array(size).fill(0));
    let minSimilarity = 100;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (i != j) {
                similarityDay[i][j] = ((Math.min(Math.abs(transactionDayList[i] - transactionDayList[j]), Math.abs(30 - Math.max(transactionDayList[i], transactionDayList[j])) + Math.min(transactionDayList[i], transactionDayList[j]))) / 30.0) * 100.0 ** 2;
                similarityAmount[i][j] = (transactionScaledAmount[i] - transactionScaledAmount[j]) ** 2;
                let rating1 = (0, StringUtil_1.stringSimilarityScore)(transactionDescription[i], [transactionDescription[j]]);
                let rating2 = (0, StringUtil_1.stringSimilarityScore)(transactionDescription[j], [transactionDescription[i]]);
                similarityTransDescription[i][j] = Math.min(100 - rating1.rating, 100 - rating2.rating) ** 2;
                similarity[i][j] = -1 * (0.25 * similarityDay[i][j] + 0.25 * similarityAmount[i][j] + 0.50 * similarityTransDescription[i][j]);
                if (minSimilarity > similarity[i][j])
                    minSimilarity = similarity[i][j];
            }
        }
    }
    for (let i = 0, j = 0; i < size; i++, j++) {
        similarity[i][j] = minSimilarity;
    }
    let configOptions = {
        damping: 0.51,
        maxIter: 50,
        convIter: 10,
        preference: -500
    };
    let results;
    try {
        results = ap.getClusters(similarity, configOptions);
        console.log("Clusters are : " + JSON.stringify(results));
        return results;
    }
    catch (e) {
        console.log("Error occurred during clustering :" + e);
    }
}
exports.createRepeatTransactionCluster = createRepeatTransactionCluster;
function classifyRepeatativePayments(dbOperator) {
    return __awaiter(this, void 0, void 0, function* () {
        let transCreditList = yield dbOperator.fetchAllCreditTransactions();
        let clusterResults = createRepeatTransactionCluster(transCreditList);
        yield storeRepeatativePayments(clusterResults, transCreditList, dbOperator);
        let transDebitList = yield dbOperator.fetchAllDebitTransactions();
        let clusterDebitList = createRepeatTransactionCluster(transDebitList);
        yield storeRepeatativePayments(clusterDebitList, transCreditList, dbOperator);
    });
}
exports.classifyRepeatativePayments = classifyRepeatativePayments;
function storeRepeatativePayments(clusterResults, transList, dbOperator) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("TransactionList is : " + JSON.stringify(transList));
        if (clusterResults && clusterResults["exemplars"] && clusterResults["clusters"]) {
            let exemplars = clusterResults["exemplars"];
            let clusters = clusterResults["clusters"];
            for (let i = 0; i < exemplars.length; i++) {
                let repeatative = {
                    name: fetchClusterName(i),
                    commonDescription: "",
                    medianClusterAmount: 0,
                    minClusterAmount: 0,
                    maxClusterAmount: 0,
                    minDateAt: null,
                    maxDateAt: null,
                    category: "",
                    recurrenceCycle: ""
                };
                let clusterAmount = [];
                let clusterDates = [];
                let clusterDescription = [];
                let minAmount = Number.MAX_VALUE;
                let maxAmount = Number.MIN_VALUE;
                for (let j = 0; j < clusters.length; j++) {
                    if (exemplars[i] === clusters[j]) {
                        clusterAmount.push(transList[j].amount);
                        clusterDates.push(transList[j].transactionAt);
                        clusterDescription.push(transList[j].transactionDescription);
                        if (minAmount > transList[j].amount)
                            minAmount = transList[j].amount;
                        if (maxAmount < transList[j].amount)
                            maxAmount = transList[j].amount;
                    }
                }
                repeatative.medianClusterAmount = median(clusterAmount);
                repeatative.minClusterAmount = minAmount;
                repeatative.maxClusterAmount = maxAmount;
                clusterDates = orderedDates(clusterDates);
                repeatative.minDateAt = clusterDates[0];
                repeatative.maxDateAt = clusterDates[clusterDates.length - 1];
                repeatative.recurrenceCycle = getRecurrenceCycle(clusterDates);
                repeatative.commonDescription = fetchCommonDescription(clusterDescription);
                console.log("Storing Repeatative Payments : " + JSON.stringify(repeatative));
                let repeatativePaymentId = yield dbOperator.storeRepeatativePayment(repeatative);
                for (let j = 0; j < clusters.length; j++) {
                    if (exemplars[i] === clusters[j]) {
                        yield dbOperator.updateTransactionModelRepaymentId(transList[j], repeatativePaymentId);
                    }
                }
            }
        }
    });
}
function median(arr) {
    arr.sort(function (a, b) { return a - b; });
    var i = arr.length / 2;
    return i % 1 == 0 ? (arr[i - 1] + arr[i]) / 2 : arr[Math.floor(i)];
}
function orderedDates(dateList) {
    let orderedDates = dateList.sort(function (a, b) {
        return a.getTime() - b.getTime();
    });
    return orderedDates;
}
const between = (val, min, max) => {
    return (min <= val) && (val <= max);
};
function getRecurrenceCycle(dateList) {
    const diff = [];
    for (var i = 0; i < dateList.length; i++) {
        const difference = dayjs(dateList[i + 1]).diff(dayjs(dateList[i]), 'day');
        diff.push(difference);
    }
    if (diff.length > 0) {
        const meanDiff = diff.reduce((o, v) => o + v, 0) / diff.length;
        console.log(`Mean Diff is ${meanDiff}`);
        if (between(meanDiff, 1, 3)) {
            return RecurrenceType_1.RecurrenceType.DAILY.toString();
        }
        else if (between(meanDiff, 4, 10)) {
            return RecurrenceType_1.RecurrenceType.WEEKLY.toString();
        }
        else if (between(meanDiff, 11, 20)) {
            return RecurrenceType_1.RecurrenceType.FORTNIGHTLY.toString();
        }
        else if (between(meanDiff, 20, 40)) {
            return RecurrenceType_1.RecurrenceType.MONTHLY.toString();
        }
        else if (between(meanDiff, 60, 90)) {
            return RecurrenceType_1.RecurrenceType.QUARTERLY.toString();
        }
        else if (between(meanDiff, 150, 210)) {
            return RecurrenceType_1.RecurrenceType.HALFYEARLY.toString();
        }
        else if (between(meanDiff, 250, 400)) {
            return RecurrenceType_1.RecurrenceType.YEARLY.toString();
        }
    }
    else {
        return '';
    }
}
function fetchCommonDescription(descList) {
    //TODO - to be implemented to see how to generate common description
    return descList[0];
}
function fetchClusterName(index) {
    return "payments-" + index;
}
