import {businessDaysCalculator} from './utilities/businessHourCalc'

function App() {
  const bdays = businessDaysCalculator('2023-03-10 22:19:26', '2023-03-15 12:19:26', '17:30:00', '01:00:00', [])
  return (
    <div>
      <p>{bdays.business_days} days</p>
      <p>{bdays.business_hours} hours</p>
    </div>
  )
}

export default App;
