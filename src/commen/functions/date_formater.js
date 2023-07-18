import moment from 'moment'

export const removeDashesFromDate = (data) => {
  let value = data.split('-')
  return `${value[0]}${value[1]}${value[2]}`
}

export const DateDisplayFormat = (data) =>
  data.slice(6, 8) + '-' + data.slice(4, 6) + '-' + data.slice(0, 4)

//Remove ":"
export const RemoveTimeDashes = (data) =>
  data.slice(0, 2) + data.slice(3, 5) + data.slice(6, 8)

// Time Format
export const TimeDisplayFormat = (data) =>
  data.slice(0, 2) + ':' + data.slice(2, 4) + ':' + data.slice(4, 6)

export const TimeHHMMFormat = (data) =>
  data.slice(0, 2) + ':' + data.slice(2, 4)

// Time Format
export const TimeAndDisplayFormat = (data) =>
  data.replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/, '$4:$5:$6')

export const DateSendingFormat = (data) => {
  if (data.length > 0) {
    let value = data.split('-')
    return `${value[2]}${value[1]}${value[0]}`
  }
}

export const currentToOneYearBackDate = (format) => {
  let _moment = moment()
  let toDate = _moment.format(format)
  let fromDate = _moment.subtract(1, 'years').format(format)
  return { toThisDate: toDate, fromThisDate: fromDate }
}
export const NumberFormater = (value) => {
  return parseFloat(parseFloat(value).toFixed(2))
}
export const CommaFormter = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const dateforCalendar = (date) => {
  return date.slice(0, 4) + ' ,' + date.slice(4, 6) + ' , ' + date.slice(6, 8)
}
export const dateTime = (data) => {
  let newtime =
    data.slice(0, 4) +
    '-' +
    data.slice(4, 6) +
    '-' +
    data.slice(6, 8) +
    ' ' +
    data.slice(8, 10) +
    ':' +
    data.slice(10, 12) +
    ':' +
    data.slice(12, 14)
  console.log(newtime, 'checkingdatetimtconvertcheckingdatetimtconvert')
  return newtime
}
export const CardNumberFormatter = (num) => {
  return num.match(/.{1,4}/g).join(' ')
}

export const newDateFormaterAsPerUTC = (date) => {
  // let dateConvert = moment(date, 'YYYYMMDD').format()

  // let newDate = new Date(dateConvert).toISOString()
  // return newDate.slice(0, 10).replace(/-/g, '')
  let dateConvert = moment(date, 'YYYYMMDD').format()
  console.log('getCalendarDataResponse', dateConvert)
  const englishFormat = moment(dateConvert).format(
    'MMMM Do, YYYY [at] HH:mm:ss',
  )
  console.log('getCalendarDataResponse', englishFormat)
  let newDate = moment(dateConvert).toDate().toISOString()
  console.log('getCalendarDataResponse', newDate)
  let formattedDate = newDate.slice(0, 10).replace(/-/g, '')
  console.log('getCalendarDataResponse', formattedDate)

  return newDate.slice(0, 10).replace(/-/g, '')
}

export const newTimeFormaterAsPerUTC = (dateTime) => {
  console.log(dateTime, 'checking12121')
  let fullDateyear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'
  let _dateTime = new Date(fullDateyear).toString('YYYYMMDDHHmmss')
  console.log(_dateTime, 'checking12121')
  return moment(_dateTime).format('h:mm A')
}

export const newTimeFormaterAsPerUTCFullDate = (dateTime) => {
  // console.log('dateTimedateTimedateTime', dateTime)
  let fullDateyear =
    dateTime?.slice(0, 4) +
    '-' +
    dateTime?.slice(4, 6) +
    '-' +
    dateTime?.slice(6, 8) +
    'T' +
    dateTime?.slice(8, 10) +
    ':' +
    dateTime?.slice(10, 12) +
    ':' +
    dateTime?.slice(12, 14) +
    '.000Z'
  let _dateTime = new Date(fullDateyear).toString('YYYYMMDDHHmmss')
  return moment(_dateTime).format('h:mm A, Do MMM, YYYY')
}

export const newTimeFormaterForResolutionAsPerUTCFullDate = (dateTime) => {
  // console.log('dateTimedateTimedateTime', dateTime)
  let fullDateyear =
    dateTime?.slice(0, 4) +
    '-' +
    dateTime?.slice(4, 6) +
    '-' +
    dateTime?.slice(6, 8) +
    'T' +
    dateTime?.slice(8, 10) +
    ':' +
    dateTime?.slice(10, 12) +
    ':' +
    dateTime?.slice(12, 14) +
    '.000Z'
  let _dateTime = new Date(fullDateyear).toString('YYYYMMDDHHmmss')
  return moment(_dateTime).format('h:mm A, D MMM, YYYY')
}

export const _justShowDateformat = (dateTime) => {
  let fullDateyear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'
  let _dateTime = new Date(fullDateyear).toString('YYYYMMDDHHmmss')
  return moment(_dateTime).format('Do MMM, YYYY')
}

export const _justShowDateformatBilling = (dateTime) => {
  let fullDateyear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'
  let _dateTime = new Date(fullDateyear).toString('YYYYMMDDHHmmss')
  return moment(_dateTime).format('D-MMM-YYYY')
}

export const _justShowDay = (dateTime) => {
  let fullDateyear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'
  let _dateTime = new Date(fullDateyear).toString('YYYYMMDDHHmmss')
  return moment(_dateTime).format('dddd')
}

export const forRecentActivity = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'
  let _dateTime = new Date(fullDateYear).toString('YYYYMMDDHHmmss')
  return _dateTime
}

export const startDateTimeMeetingCalendar = (dateTime) => {
  console.log('newListnewListnewList', dateTime)

  let fullDateYear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'
  console.log('newListnewListnewList', fullDateYear)

  // let _dateTime = new Date(fullDateYear).toString('YYYYMMDDHHmmss')
  let _dateTime = moment(fullDateYear, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format(
    'YYYYMMDD',
  )
  console.log('newListnewListnewList', _dateTime)

  return _dateTime
}

export const forSetstartDateTimeMeetingCalendar = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'
  let _dateTime = new Date(fullDateYear).toString('YYYYMMDDHHmmss')
  // let _dateTime = moment(fullDateYear, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYYMMDD');

  return _dateTime
}

export const forHomeCalendar = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'
  let _dateTime = moment(fullDateYear, 'YYYYMMDDHHmmss').toDate()

  return _dateTime
}
export const endDateTimeMeetingCalender = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'
  let _dateTime = new Date(fullDateYear).toString('YYYYMMDDHHmmss')
  return _dateTime
}

export const createResolutionDateTime = (dateTime) => {
  console.log('createResolutionDateTime12', dateTime)
  // let convertUTC = new Date(dateTime,"YYYYMMDDHHmmss").toISOString()
  let fullDateYear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'
  let _dateTime = moment(dateTime, 'YYYYMMDDHHmmss').toISOString()
  let convertGMT = new Date(_dateTime).toString()
  console.log(
    'createResolutionDateTime12',
    _dateTime,
    convertGMT,
    dateTime.split('T'),
  )
  return _dateTime
}

export const editResolutionDate = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'
  let convertGMT = new Date(fullDateYear)
  let convertDate = moment(convertGMT).format('YYYY-MM-DD')
  console.log(convertDate, 'convertDateconvertDateconvertDate')
  return convertDate
}

export const editResolutionTime = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'
  let convertGMT = new Date(fullDateYear).toString()
  let convertTime = moment(convertGMT).format('HH:mm')
  console.log(convertTime, convertGMT, 'convertDateconvertDateconvertDate')
  return convertTime
}

export const resolutionResultTable = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    '-' +
    dateTime.slice(4, 6) +
    '-' +
    dateTime.slice(6, 8) +
    'T' +
    dateTime.slice(8, 10) +
    ':' +
    dateTime.slice(10, 12) +
    ':' +
    dateTime.slice(12, 14) +
    '.000Z'

  let convertTime = new Date(fullDateYear)
  console.log(
    'convertTimeconvertTimeconvertTimeconvertTimeconvertTime',
    convertTime,
  )
  return convertTime
}

export const createConvert = (dateTime) => {
  console.log(dateTime, 'createConvertcreateConvert') // Output: "20230505123456"
  let convertintoISO = moment(dateTime, 'YYYYMMDDHHmmss').toISOString()
  var utcDate = new Date(convertintoISO).toUTCString()
  console.log(utcDate, 'createConvertcreateConvert') // Output: "20230505123456"
  console.log(convertintoISO, 'createConvertcreateConvert') // Output: "20230505123456"

  // Convert ISO date string to a Date object
  const date = new Date(utcDate)

  // Extract the individual components of the date
  const year = date.getUTCFullYear()
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
  const day = ('0' + date.getUTCDate()).slice(-2)
  const hours = ('0' + date.getUTCHours()).slice(-2)
  const minutes = ('0' + date.getUTCMinutes()).slice(-2)
  const seconds = ('0' + date.getUTCSeconds()).slice(-2)

  // Concatenate the components into the desired format
  const result = `${year}${month}${day}${hours}${minutes}${seconds}`

  return result
}

export const EditmeetingDateFormat = (dateTime) => {
  console.log('convertintoISOconvertintoISO', dateTime)
  let newDate = new Date(dateTime)
  let convertintoISO = moment(dateTime, 'YYYYMMDDHHmmss').toString()
  let fullDateyear =
    dateTime?.slice(0, 4) +
    '-' +
    dateTime?.slice(4, 6) +
    '-' +
    dateTime?.slice(6, 8) +
    'T' +
    dateTime?.slice(8, 10) +
    ':' +
    dateTime?.slice(10, 12) +
    ':' +
    dateTime?.slice(12, 14) +
    '.000Z'
  let _dateTime = new Date(fullDateyear).toString('YYYYMMDDHHmmss')
  console.log(
    convertintoISO,
    _dateTime,
    moment(_dateTime).format('DD/MM/YYYY'),
    'convertintoISOconvertintoISO',
  )
  return _dateTime
}

export const newTimeFormaterAsPerUTCTalkTime = (dateTime) => {
  // console.log('dateTimedateTimedateTime', dateTime)
  let fullDateyear =
    dateTime?.slice(0, 4) +
    '-' +
    dateTime?.slice(4, 6) +
    '-' +
    dateTime?.slice(6, 8) +
    'T' +
    dateTime?.slice(8, 10) +
    ':' +
    dateTime?.slice(10, 12) +
    ':' +
    dateTime?.slice(12, 14) +
    '.000Z'
  let _dateTime = new Date(fullDateyear).toString('YYYYMMDDHHmmss')
  return moment(_dateTime).format('hh:mm a')
}

export const newTimeFormaterAsPerUTCTalkDate = (dateTime) => {
  // console.log('dateTimedateTimedateTime', dateTime)
  let fullDateyear =
    dateTime?.slice(0, 4) +
    '-' +
    dateTime?.slice(4, 6) +
    '-' +
    dateTime?.slice(6, 8) +
    'T' +
    dateTime?.slice(8, 10) +
    ':' +
    dateTime?.slice(10, 12) +
    ':' +
    dateTime?.slice(12, 14) +
    '.000Z'
  let _dateTime = new Date(fullDateyear).toString('YYYYMMDDHHmmss')
  return moment(_dateTime).format('DD-MMM-YYYY')
}

export const newTimeFormaterAsPerUTCTalkDateTime = (dateTime) => {
  // console.log('dateTimedateTimedateTime', dateTime)
  let fullDateyear =
    dateTime?.slice(0, 4) +
    '-' +
    dateTime?.slice(4, 6) +
    '-' +
    dateTime?.slice(6, 8) +
    'T' +
    dateTime?.slice(8, 10) +
    ':' +
    dateTime?.slice(10, 12) +
    ':' +
    dateTime?.slice(12, 14) +
    ".000Z";
  let _dateTime = new Date(fullDateyear).toString("YYYYMMDDHHmmss");
  return moment(_dateTime).format("h:mm A, Do MMM, YYYY");
};


export const convertGMTDateintoUTC = (GMTdate) => {
  console.log(GMTdate, "convertGMTDateintoUTC")
  const currentDate = new Date(GMTdate);
  console.log(GMTdate, "convertGMTDateintoUTC")
  // Extract the individual components of the date
  const year = currentDate.getUTCFullYear();
  const month = ("0" + (currentDate.getUTCMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getUTCDate()).slice(-2);
  const hours = ("0" + currentDate.getUTCHours()).slice(-2);
  const minutes = ("0" + currentDate.getUTCMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getUTCSeconds()).slice(-2);

  // Concatenate the components into the desired format
  const result = `${year}${month}${day}${hours}${minutes}${seconds}`;
  console.log(result, "convertGMTDateintoUTC")
  return result;
}
