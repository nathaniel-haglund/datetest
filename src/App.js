import { businessDaysCalculator } from "./utilities/businessHourCalc";

function App() {
  const holiday = "2023-05-05";
  const holiday2 = "2023-05-17";
  const bdays = businessDaysCalculator(
    "2023-05-01 00:45:23",
    "2023-06-08 00:35:00",
    "15:00:00",
    "14:59:59",
    [holiday, holiday2]
  );
  return (
    <div>
      <p>Business Hour Calculator</p>
      <p>{bdays.business_days} days</p>
      <p>{bdays.business_hours} hours</p>
    </div>
  );
}

export default App;
