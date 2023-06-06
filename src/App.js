import {businessDaysCalculator} from './utilities/businessHourCalc'

function App() {
  const bdays = businessDaysCalculator('2023-06-05 18:58:23', '2023-06-06 00:35:00', '12:30:00', '01:00:00', [])
  return (
    <div>
      <p>{bdays.business_days} days</p>
      <p>{bdays.business_hours} hours</p>
    </div>
  )
}

export default App;
