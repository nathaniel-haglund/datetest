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
  console.log('milliBusinessStart', milliBusinessStart / hour)
  const milliBusinessEnd = (endBusinessDay.split(':')[0] * hour) + (endBusinessDay.split(':')[1] * minute)
  console.log('milliBusinessEnd', milliBusinessEnd / hour)
  const milliStartTime = (startTime.split(':')[0] * hour) + (startTime.split(':')[1] * minute)
  console.log('milliStartTime', milliStartTime)
  const businessDay = milliBusinessEnd - milliBusinessStart
  console.log('business day', businessDay / hour)
 
  let count = 0

  const firstDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0)
  console.log('first date', firstDate)
  const lastDate = new Date(Date.now())
  console.log('last date', lastDate)
  const lastDateMidnight = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate(), 0, 0, 0)
  console.log('last date midnight', lastDateMidnight)

  //add first day time
  console.log('start time', startTime)
  console.log('else count', ((firstDate.getTime() + milliBusinessEnd) - (firstDate.getTime() + milliStartTime)) / hour )
  if (holidays.filter(day => day.getTime() === firstDate.getTime()).length === 0) {

    if (firstDate.getTime() + milliBusinessStart > firstDate.getTime() + milliStartTime) {
      count += businessDay
    } else {
      count += (firstDate.getTime() + milliBusinessEnd) - (firstDate.getTime() + milliStartTime)
    }
  } 
  console.log('time added for first day', count / hour)
  
  //add last day time
  const firstDay = count
  console.log('holiday last day', holidays[0], lastDateMidnight)
  if (holidays.filter(day => day.getTime() === lastDateMidnight.getTime()).length === 0){
    if (lastDate.getTime() < (lastDateMidnight.getTime() + milliBusinessEnd) && lastDate.getTime() > (lastDateMidnight.getTime() + milliBusinessStart)) {
      count += lastDate.getTime() - (lastDateMidnight.getTime() + milliBusinessStart)
    } else if (lastDate.getTime() > (lastDateMidnight.getTime() + milliBusinessEnd)) {
      count += businessDay
    }
  }
  console.log('last date time added', (count - firstDay) / hour)

  //remove first and last day
  firstDate.setDate(firstDate.getDate() + 1)
  lastDate.setDate(lastDate.getDate() - 1)


  while (firstDate <= lastDate) {
    const dayOfWeek = firstDate.getDay()
    if(dayOfWeek !== 0 && dayOfWeek !== 6 && holidays.filter(day => day.getTime() === firstDate.getTime()).length === 0) {
      count += businessDay
    }
    console.log('hit and count', firstDate, count / hour)
    console.log('holidays', holidays)
    firstDate.setDate(firstDate.getDate() + 1)
  }

  return `${Math.floor(count / businessDay )} days / ${Math.floor(count % businessDay / hour)} hours / ${Math.floor(count % businessDay % hour / minute)} minutes`
}

  return (
    <div>
      <h1>There are {businessHours()} business time between dates</h1>

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
