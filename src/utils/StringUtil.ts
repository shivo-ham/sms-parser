import {findBestMatch} from 'string-similarity'

/**
 * Method to clean up sms body
 * @param body string raw sms body 
 * @returns cleaned sms content
 */
export function cleanSmsContent(body: string): string {
  return body.replace(/\(|\)|,/g, '')
    .replace(/[\t\n\r]/gm,' ')
    .replace(/  +/g, ' ')
    .replace(/'/g,'')
    .replace(/"/g,'')
    .split(' ')
    .join(' ')
}

export function cleanSmsAddress(address: string): string {
  console.log("customer ID is :" + address)
  if (address) {
    if (address.indexOf('-') == -1) {
      let addressTrim = address.trim().toUpperCase()
      if(addressTrim.length >= 8){
        addressTrim = addressTrim.slice(2)
      }
      return addressTrim
    } else {
      return address.split('-')[1]?.trim().toUpperCase()
    }
  }
  return null
}


export function cleanAmount(amount: string): number {
  let result: number = null
  if (amount && amount !== null) {
    result = Number(amount.replace(/,/g, '').replace(/\s/g, ''))
  }
  return result
}

export function formatAccountNumbers(accountNumber: string) {
  let actualAccountNumber = null
  if (accountNumber === null || typeof accountNumber === 'undefined') {
    return { accountNumber: accountNumber, actualAccountNumber: actualAccountNumber }
  }
  if (isFullAccountNumber(accountNumber)) {
    actualAccountNumber = accountNumber
  }
  accountNumber = trimAccountNumber(accountNumber)
  return { accountNumber: accountNumber, actualAccountNumber: actualAccountNumber }
}


export function stringSimilarityScore(s1:string, s2:string[]){
  let bestMatch =  findBestMatch(s1,s2)
  // console.log("Best Match is - " + JSON.stringify(bestMatch))
  let rating = bestMatch.bestMatch.rating
  let bestMatchIndex = bestMatch.bestMatchIndex
  // console.log("Similarity rating - "+rating + " and best match index is : "+bestMatchIndex)
  if(rating)return{rating:rating*100,index:bestMatchIndex}
  return {rating:0,index:-1}
}

export function enumFromStringValue<T> (enm: { [s: string]: T}, value: string): T | undefined {
  let isEnum =  (Object.values(enm) as unknown as string[]).includes(value)
    // ? value as unknown as T
    // : undefined;
  if(isEnum) return value as unknown as T
  else {
    console.error(`Could create enum value: ${value}`)
    return undefined
  }  
}

function isFullAccountNumber(accountNo: string): boolean {
  const specialCharacters = ['x', '*']
  return specialCharacters.every(sc => accountNo.toLowerCase().indexOf(sc) === -1)
}

function trimAccountNumber(accountNumber: string) {
  let last4 = accountNumber.replace(/\*/g, 'X').toUpperCase().slice(-4)
  return last4.padStart(6, 'X')

}