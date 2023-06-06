import {businessDaysCalculator} from './utilities/businessHourCalc'

function App() {
  const bdays = businessDaysCalculator('2023-06-04 00:45:23', '2023-06-05 00:35:00', '17:30:00', '02:00:00', [])
  return (
    <div>
      <p>{bdays.business_days} days</p>
      <p>{bdays.business_hours} hours</p>
    </div>
  )
}

export default App;
