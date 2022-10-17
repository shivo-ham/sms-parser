
// export function parseRawSMSDate(dateTime:string): Date{
//   return  moment(dateTime,'YYYY-MM-DD hh:mm:ss').toDate()
// }
import * as dayjs from 'dayjs'
// import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as _ from 'dayjs/locale/en-in'

dayjs.locale('en-in')
// dayjs.extend(customParseFormat)

export function parseDateTime(dateFormats: string, dateString: string, smsSentAt: string): Date {
  // return dayjs(smsSentAt).toDate()
  console.log("Date Formats are :" + JSON.stringify(dateFormats))
  let resultDate: Date =dayjs(smsSentAt).toDate()
  if (dateString) {
    let cleanDateString = dateString?.trim().replace(/at /g, '')
    if (dateFormats) {
      let dateFormatArray = dateFormats.split(',')
      for (let dateFormat of dateFormatArray) {
        console.log("Date Formats Array is :" + JSON.stringify(dateFormatArray))
        console.log("Date Format before is :" + dateFormat)
        dateFormat = dateFormat.trim().replace(/at /g, '')
        console.log("Date Format is :" + dateFormat)
        resultDate = strictDateParsing(cleanDateString, dateFormat, smsSentAt)
        if (resultDate) break;
      }
    }
  }
  return resultDate
}

export function strictDateParsing(dateString: string, format: string, smsDate: string): Date {
  console.log("Inside Strict Date Parsing format: " + format + " for date string: " + dateString)
  // dayjs.extend(advanced)
  let result = dayjs(dateString,format,'en-in')
  console.log("Result is : "+ result)
  let defaultResult = dayjs(smsDate).toDate()
  if (result) {
    console.log("Valid Date format: " + format + " for date string: " + dateString+" and result is :"+JSON.stringify(result))
    console.log("Hour, minute and seconds are : "  + result.hour() + " "+result.minute() + " "+result.second())
    // Formats that dont have year
    if (format.indexOf('Y') === -1) {
      console.log("Result in index of Y is: "+ result.toDate())
      const thisYear = dayjs(smsDate).year()
      result = result.year(thisYear)
    }
    console.log("Debugging before isHourMinuteSecondPresent " + JSON.stringify(result))
    if(isHourMinuteSecondPresent(result)){
       console.log("Hours minutes and seconds all are not zero")
       console.log("This result is " + JSON.stringify(result.toDate()))
       return result.toDate()
    }
    else{
      console.log("Default result is :" + JSON.stringify(defaultResult))
      return defaultResult
    }
  } else {
    console.log("Invalid Date format: " + format + " for date string: " + dateString)
    console.log("SMS sent at "+smsDate)
    if(smsDate){
      return defaultResult
    }
    return undefined
  }
}

export async function getTimeWithOffsetInMinutes(baseTime:Date,offset:number){
    let result = new Date(baseTime.getTime())
    result.setMinutes(baseTime.getMinutes()-offset)
    console.log("Basetime is "+JSON.stringify(baseTime) + " Result date is : "+ JSON.stringify(result))
    return result
}

export function isHourMinuteSecondPresent(date:dayjs.Dayjs):boolean{
  console.log("Inside isHourMinuteSecondPresent  - "+ date.hour()+" "+date.minute()+" "+date.second())
  return !(date.second() === 0 && date.minute()==0 && date.hour()==0)
}

export async function findClosestDate(arr:Date[],target:Date):Promise<number>{
  let timeDiff = Number.MAX_VALUE
  let index = 0
  const d1 = dayjs(target)
  for(let i =0; i<arr.length; i++){
    const d2 =  dayjs(arr[i])
    let diff = d1.diff(d2)
    if(diff < timeDiff){
      timeDiff=diff
      index = i
    }
  }
  return index
}