import { HdfcBankHandler } from "./hdfc";
import { ICICIBankHandler } from "./icici";
import { SbiHandler } from "./sbi";

const handlerMapper = {
  'ICICIB': ICICIBankHandler,
  'HDFCB': HdfcBankHandler,
  'SBISMS': SbiHandler
}

const handlerFactory = () => {
  
}