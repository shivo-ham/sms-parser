import 'jest'
import {strictDateParsing} from '../../../src/utils/DateUtil'

describe('TestStrictDateParsing',()=>{
  let dateString
  let format
  test('strict date parsing for DD/MMM/YYYY',()=>{
    dateString = "09-09-2022"
    format = "DD-MM-YYYY"
    const result:Date = strictDateParsing(dateString,format,'')
    expect(result).toBeDefined()
  })
})