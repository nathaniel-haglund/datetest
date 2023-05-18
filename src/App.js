import { useState } from 'react'
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function App() {
const [holidays, setHolidays] = useState([])
const [startDate, setStartDate] = useState(new Date())
const [endDate, setEndDate] = useState(new Date())
const [holidayToAdd, setAdd] = useState(new Date())

const businessHours = () => {
  let count = 0
  const currentDate = new Date(startDate.getTime())
  while (currentDate <= endDate.getTime()) {
    const dayOfWeek = currentDate.getDay()
    if(dayOfWeek !== 0 && dayOfWeek !== 6 && holidays.filter(day => day.getTime() === currentDate.getTime()).length === 0) {
      count++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return count * 9
}

  return (
    <div>
      <h1>There are {businessHours()} business hours between dates</h1>
      <p>start date</p>
      <ReactDatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
      <p>end date</p>
      <ReactDatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
      <p>Add holiday</p>
      <ReactDatePicker selected={holidayToAdd} onChange={(date) => setAdd(date)} />
      <button onClick={() => setHolidays([...holidays, holidayToAdd])}>Add holiday</button>
      <p>holidays</p>
      {holidays.map(day => <p>{`${day.getMonth()+1}/${day.getDate()}`}</p>)}
    </div>
  )
}

export default App;
