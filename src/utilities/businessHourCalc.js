const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60

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
  const holidaylist = []
  const startDate = dateMaker(startingTime.split(' ')[0])
  const startTime = timeMaker(startingTime.split(' ')[1])
  const endDate = dateMaker(endingTime.split(' ')[0])
  const endTime = timeMaker(endingTime.split(' ')[1])
  const milliBusinessStart = timeMaker(businessStart)
  const milliBusinessEnd = timeMaker(businessEnd) < timeMaker(businessStart) ? timeMaker(businessEnd) + (24 * HOUR) : timeMaker(businessEnd)
  const businessDay = milliBusinessEnd - milliBusinessStart
  
  console.log(businessDay)

//creates returned object
  const countFormatter = count => {
    return {
      business_days: Math.round(count/ businessDay),
      business_hours: Math.round(count / HOUR ),
    }
  }

//holiday checking function returns true if day is a holiday
  const isHoliday = (day) => holidaylist.filter(holiday => holiday.getTime() === day.getTime()).length === 0 ? false : true
  
  let count = 0
  holidaylist.concat(holidays)

  //Check if start date in the future
  if(endDate.getTime() + endTime < startDate.getTime() + startTime) { return countFormatter(count) }

  //check if start time current day
  if (startDate.getTime() === endDate.getTime()) {

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
      }else {
        count += endTime - milliBusinessStart
        console.log('count', count)
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
    if (endTime < milliBusinessEnd && endTime > milliBusinessStart) {
      count += endTime - milliBusinessStart
      
    //if current time is after business end  
    } else if (endTime > milliBusinessEnd) {
      count += businessDay
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
