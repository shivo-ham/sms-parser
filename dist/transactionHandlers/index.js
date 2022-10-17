"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hdfc_1 = require("./hdfc");
const icici_1 = require("./icici");
const sbi_1 = require("./sbi");
const handlerMapper = {
    'ICICIB': icici_1.ICICIBankHandler,
    'HDFCB': hdfc_1.HdfcBankHandler,
    'SBISMS': sbi_1.SbiHandler
};
const handlerFactory = () => {
};
