import { DBOperator } from "../database/DBOperator";
import { SmsData } from "../dataModels/SmsData";
import { SmsDataBaseModel } from "../dataModels/SmsDataBaseModel";
/**
 * This method can be used by both server and client side, the sms data should confirm
 * to SmsData for client side whereas SmsModel for server side. Apart from this DBoperator
 * interface should be implemented with respective query language(only SQL) of your choice
 *
 * @param customerId integeral value customer id
 * @param sms SMS Object that is captured on client device side or SMS model on server side
 * @param dbOperator instance of DBOperator class to be implemented by code using this function
 */
export declare function processSMS(customerId: number, sms: SmsDataBaseModel, dbOperator: DBOperator): Promise<void>;
/**
 * To be Implemented if we need to ingest batch sms, performance of queries can be improved
 * @param batchSms array of SmsData
 */
export declare function parseBatchSms(batchSms: SmsData[]): void;
