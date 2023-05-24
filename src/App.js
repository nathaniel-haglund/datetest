import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {businessDaysCalculator} from './utilities/businessHourCalc'

function App() {
  const bdays = businessDaysCalculator('2023-04-12 10:19:26', '2023-05-22 22:19:26', '07:30:00', '17:00:00', [])
  return (
    <div>
      <p>{bdays.business_days} days</p>
      <p>{bdays.business_hours} hours</p>
    </div>
  )
}

export default App;
