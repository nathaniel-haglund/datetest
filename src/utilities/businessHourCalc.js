//Business day calculator returns the number of business days and hours passed between two times
//startingTime is the timestamp to begin the calculation (formatted "YYYY-MM-DD HH:MM:SS")
//endingTime is the timestamp of when to end the calculation (formatted "YYYY-MM-DD HH:MM:SS")
//businessStart is the time the business day begins (formatted "HH:MM:SS")
//businessEnd is the time the business day ends (formatted "HH:MM:SS)
//for a 24 hour business day, businessStart = 00:00:00 businessEnd = 23:59:59 (or an equivalent timescale e.g. businessStart = 13:00:00 businessEnd = 12:59:59)
//holidays is an array of business holiday timestamps at midnight of the holiday from the same timezone as the startingTime (formatted ["YYYY-MM-DD HH:MM:SS"])

//Time units in milliseconds for calculation
const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

//Takes date in format YYYY-MM-DD and creates javascript timestamp in UTC
const dateMaker = (date) => {
  const [year, month, day] = date.split('-')
  return new Date(`${year}-${month}-${day}T00:00:00`)
}

//converts time in HH:MM:SS 24 hour format to milliseconds from midnight
const timeMaker = (time) => {
  const [hours, minutes, seconds] = time.split(':')
  return (hours * HOUR) + (minutes * MINUTE) + (seconds * SECOND)
}


const businessDaysCalculator = (startingTime, endingTime, businessStart, businessEnd, holidays) => {
  const startDate = dateMaker(startingTime.split(' ')[0])
  const startTime = timeMaker(startingTime.split(' ')[1])
  const endDate = dateMaker(endingTime.split(' ')[0])
  const milliBusinessStart = timeMaker(businessStart)
  const milliBusinessEnd = timeMaker(businessEnd) < timeMaker(businessStart) ? timeMaker(businessEnd) + DAY : timeMaker(businessEnd)
  const endTime = timeMaker(endingTime.split(' ')[1]) + DAY < milliBusinessEnd ? timeMaker(endingTime.split(' ')[1]) + DAY : timeMaker(endingTime.split(' ')[1])
  const businessDay = milliBusinessEnd - milliBusinessStart


//creates returned object
  const countFormatter = count => {
    return {
      business_days: Math.floor(count/ businessDay),
      business_hours: Math.floor(count / HOUR),
    }
  }

//holiday checking function returns true if business day begins within 24 hours of a holiday timestamp
  const isHoliday = (day) => holidaylist.filter(holiday => holiday.getTime() <= day.getTime() + milliBusinessStart && day.getTime() + milliBusinessStart <= holiday.getTime() + DAY).length === 0 ? false : true
  
//Populate holidaylist with holidays
  const holidaylist = holidays.map(days => {
    const dayDate = days.split(' ')[0]
    const dayTime = days.split(' ')[1]
    const [year, month, day] = dayDate.split('-')
    const [hours, minutes, seconds ] = dayTime.split(':')
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`)

  })

  //set count for hour calculation
  let count = 0
 

  //Check if start date in the future
  if(endDate.getTime() + endTime < startDate.getTime() + startTime || endDate < startDate ) { return countFormatter(count) }
  
  //Add previous business day hours in multi calendar day business span scenario
  if(startTime < milliBusinessEnd - DAY) {
    count += milliBusinessEnd - DAY - startTime
  }
  //check if start time current day
  if (startDate.getTime() + milliBusinessEnd >= endDate.getTime() + timeMaker(endingTime.split(' ')[1])) {

    //check if it is a holiday
    if (isHoliday(startDate, holidaylist)) {
      return countFormatter(count)
    }
    
    //check if start time is after business close
    if(startTime > milliBusinessEnd) {
      return countFormatter(count)
    }
    
    //If start time before business open
    if (milliBusinessStart >= startTime) {

      //If current time after business close
      if (endTime >= milliBusinessEnd) {
        count += businessDay

      //If current time before business close
      }if (endTime >= milliBusinessStart && endTime <= milliBusinessEnd) {
        count += endTime - milliBusinessStart
      }

    //If start time after business open
    } else {

      //if current time after business close
        if (endTime >= milliBusinessEnd) {
          count += milliBusinessEnd - startTime

        //If current time before business close
        }else {
          count += endTime - startTime
        }
      }
    return countFormatter(count)
  }

    //if multiple days, add first day time
  //Check if first day is holiday
  if (!isHoliday(startDate)) {

    //If start of business is after start time
    if (milliBusinessStart > startTime) {
      count += businessDay

    //if start time between business hours 
    } else if (startTime > milliBusinessStart && startTime < milliBusinessEnd) {
      count += milliBusinessEnd - startTime

    }
  }

  //if multiple days, add last day time
  //check if last day is holiday
  if (!isHoliday(endDate)){

    //if current time is between business hour
    if (endTime < milliBusinessEnd && endTime > milliBusinessStart && endTime < DAY) {
      count += endTime - milliBusinessStart
      
    //if current time is after business end  
    } else if (endTime > milliBusinessEnd && endTime < DAY) {
      count += businessDay

    //remove time in a multi calendar day business day scenario
    } else if (endTime < milliBusinessEnd && endTime > milliBusinessStart && endTime > DAY) {
      count -= milliBusinessEnd - endTime
    }

  }

  //remove first and last day
  startDate.setDate(startDate.getDate() + 1)
  endDate.setDate(endDate.getDate() - 1)

  //add remaining business days
  while (startDate <= endDate) {
    //Check if day is Saturday/Sunday/Holiday
    const dayOfWeek = startDate.getDay()
    if(dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(startDate)) {
      count += businessDay
    }
    //move date forward one day
    startDate.setDate(startDate.getDate() + 1)
  }

  //formatted results
  return countFormatter(count)
}

module.exports = { businessDaysCalculator }
