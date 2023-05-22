import { useState } from 'react'
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
const [holidays, setHolidays] = useState([])
const [startDate, setStartDate] = useState(new Date())
const [startTime, setStartTime] = useState('00:00')
const [holidayToAdd, setAdd] = useState(new Date())
const [startBusinessDay, setStartBusinessDay] = useState('00:00')
const [endBusinessDay, setEndBusinessDay] = useState('00:00')
const second = 1000
const minute = 60 * second
const hour = 60 * minute


const businessHours = () => {
  const milliBusinessStart = (startBusinessDay.split(':')[0] * hour) + (startBusinessDay.split(':')[1] * minute)
  const milliBusinessEnd = (endBusinessDay.split(':')[0] * hour) + (endBusinessDay.split(':')[1] * minute)
  const milliStartTime = (startTime.split(':')[0] * hour) + (startTime.split(':')[1] * minute)
  const businessDay = milliBusinessEnd - milliBusinessStart
 
  let count = 0

  const firstDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0)
  const lastDate = new Date(Date.now())
  const lastDateMidnight = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate(), 0, 0, 0)

  //Check if start date in the future
  if(lastDate.getTime() < firstDate.getTime() + milliStartTime) { return `Hasn't started yet` }
  
  //check if start time current day
  if (firstDate.getTime() === lastDateMidnight.getTime()) {

    //If start time before business open
    if (milliBusinessStart >= milliStartTime) {

      //If current time after business close
      if (lastDate.getTime() >= firstDate.getTime() + milliBusinessEnd) {
        count += businessDay
      //If current time before business close
      }else {
        count += lastDate.getTime() - (firstDate.getTime() + milliBusinessStart)
      }
    //If start time after business open
    } else {
      //if current time after business close
        if (lastDate.getTime() >= firstDate.getTime() + milliBusinessEnd) {
          count += milliBusinessEnd - milliStartTime
        //If current time before business close
        }else {
          count += lastDate.getTime() - (firstDate.getTime() + milliStartTime)
        }
      }
    console.log('count', count / hour)
    return `${Math.floor(count / businessDay )} days / ${Math.floor(count % businessDay / hour)} hours / ${Math.floor(count % businessDay % hour / minute)} minutes`
  }

  //if multiple days, add first day time
  //Check if first day is holiday
  if (holidays.filter(day => day.getTime() === firstDate.getTime()).length === 0) {

    //If start of business is after start time
    if (firstDate.getTime() + milliBusinessStart > firstDate.getTime() + milliStartTime) {
      count += businessDay

    //if start time after start of business day  
    } else {
      count += milliBusinessEnd - milliStartTime
    }
  }


  //if multiple days, add last day time
  //check if last day is holiday
  if (holidays.filter(day => day.getTime() === lastDateMidnight.getTime()).length === 0){
    //if current time is between business hour
    if (lastDate.getTime() < (lastDateMidnight.getTime() + milliBusinessEnd) && lastDate.getTime() > (lastDateMidnight.getTime() + milliBusinessStart)) {
      count += lastDate.getTime() - (lastDateMidnight.getTime() + milliBusinessStart)
    //if current time is after business end  
    } else if (lastDate.getTime() > (lastDateMidnight.getTime() + milliBusinessEnd)) {
      count += businessDay
    }
  }


  //remove first and last day
  firstDate.setDate(firstDate.getDate() + 1)
  lastDate.setDate(lastDate.getDate() - 1)

  //add remaining business days
  while (firstDate <= lastDate) {
    const dayOfWeek = firstDate.getDay()
    if(dayOfWeek !== 0 && dayOfWeek !== 6 && holidays.filter(day => day.getTime() === firstDate.getTime()).length === 0) {
      count += businessDay
    }
    firstDate.setDate(firstDate.getDate() + 1)
  }

  //formatted results
  return `${Math.floor(count / businessDay )} days / ${Math.floor(count % businessDay / hour)} hours / ${Math.floor(count % businessDay % hour / minute)} minutes`
}

  return (
    <div>
      <h1>{businessHours()}</h1>
      <h2>business time since start date</h2>
      <br />
      <br />
        <input type="time" onChange={(event) => setStartBusinessDay(event.target.value)} />
        <p>Start of business day</p>
        <input type="time" onChange={(event) => setEndBusinessDay(event.target.value)} />
        <p>End of business day</p>
        <input type="time" onChange={(event) => setStartTime(event.target.value)} />
        <p>start time</p>
        <ReactDatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <p>start date</p>
        <ReactDatePicker selected={holidayToAdd} onChange={(date) => setAdd(date)} />
        <button onClick={() => setHolidays([...holidays, new Date(holidayToAdd.getFullYear(), holidayToAdd.getMonth(), holidayToAdd.getDate(), 0, 0, 0)])}>Add holiday</button>
        <p>holidays</p>
        {holidays.map(day => <p>{`${day.getMonth()+1}/${day.getDate()}`}</p>)}
    </div>
  )
}

export default App;
