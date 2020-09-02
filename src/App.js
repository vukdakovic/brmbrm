import React, {useState} from 'react';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import * as dates from './datesAndDays';
import './App.css';

function App() {
  const [inputDate, setInputDate] = useState();
  const [brmbrmCount, setBrmbrmCount] = useState(0);
  const [outputText, setOutputText] = useState();

  const daysBetweenCounter = (dateNew, dateOld) => {
    return Math.floor((dateNew.getTime() - dateOld.getTime()) / (1000*60*60*24));
  };

  // To calculate the number of times Victor said brmbrm from month twelve:
  // between 7:00 to 11:00 he says brmbrm every 3 minutes, and between 14:00 to 20:00 he says BrmBrm every 4 minutes
  const brmbrmPeak = (11 - 7) * 60 / 3 + (20 - 14) * 60 / 4;

  // Final peak happens at one point when Viktor stops taking a nap at which point we calculate:
  // between 7:00 when he wakes up to noon he says brmbrm every 3 minutes, and between noon to 20:00 he says BrmBrm every 4 minutes
  const brmbrmFinalPeak = (12 - 7) * 60 / 3 + (20 - 12) * 60 / 4;

  // To calculate linear growth of brmbrm's every day after months six to the peak of brmbrm's we need to:
  // Find out how many days are between 1st of June 2019 and 1st of December 2019
  const daysBetweenMonthSixAndTwelve = daysBetweenCounter(dates.monthTwelve, dates.monthSix);

  // Days between month 12 and month 18 when we have a constant brmbrm number
  const daysBetweenMonthTwelveAndEighteen = daysBetweenCounter(dates.monthEighteen, dates.monthTwelve);

  // To calculate linear growth of brmbrm's every day after months six to the peak of brmbrm's we need to:
  // divide the peak number of brmbrm's after month twelve and the number of days between month six and month twelve plus 1 more day because the peak should happen on the 1st of december
  const brmbrmLinearGrowth = brmbrmPeak / (daysBetweenMonthSixAndTwelve + 1);

  const writeDateHandler = (event) => {
    let pickedDate = new Date(event);
    let dayCount = daysBetweenCounter(pickedDate, dates.birth);
    let brmbrms = 0;
    if (pickedDate < dates.birth) {
      setOutputText("Viktor isn't there just yet!");
    } else if (pickedDate < dates.monthSix) {
      setOutputText("Viktor is too young to say brmbrm.");
    } else if (pickedDate < dates.monthTwelve) {
      brmbrms = brmbrmToTwelveCounter(daysBetweenCounter(pickedDate, dates.monthSix));
      setOutputText("Viktor said " + new Intl.NumberFormat().format(brmbrms) + " BrmBrm's");
    } else if (pickedDate < dates.monthEighteen) {
      brmbrms = brmbrmToEighteenCounter(daysBetweenCounter(pickedDate, dates.monthTwelve));
      setOutputText("Viktor said " + new Intl.NumberFormat().format(brmbrms) + " BrmBrm's");
    } else {
      brmbrms = brmbrmAfterEighteenCounter(daysBetweenCounter(pickedDate, dates.monthEighteen));
      setOutputText("Viktor said " + new Intl.NumberFormat().format(brmbrms) + " BrmBrm's");
    }
  }

  const onChange = (event) => {
    console.log(event);
  }

  const brmbrmToTwelveCounter = (days) => {
    let sum = 0;
    let brmbrms = 0;
    for (let i = 0; i <= days; i++) {
      sum += brmbrmLinearGrowth;
      brmbrms += Math.floor(sum);
    }
    return brmbrms;
  }

  const brmbrmToEighteenCounter = (days) => {
    // Minus 1 because the 1st of december shouldn't be counted
    let brmbrms = brmbrmToTwelveCounter(daysBetweenMonthSixAndTwelve - 1);
    for (let i = 0; i <= days; i++) {
      brmbrms += brmbrmPeak;
    }
    return brmbrms;
  }

  const brmbrmAfterEighteenCounter = (days) => {
    let brmbrms = brmbrmToEighteenCounter(daysBetweenMonthTwelveAndEighteen);
    for (let i = 0; i <= days; i++) {
      if (i >= 180) {
        brmbrms += brmbrmFinalPeak;
      }
      else if (i >= 120) {
        let i2 = (i + 1) - 120;
        brmbrms += Math.floor(((11 - 7) * 60 + i2) / 3 + ((20 - 14) * 60 + 120) / 4);
      }
      else {
        brmbrms += Math.floor(((11 - 7) * 60) / 3 + ((20 - 14) * 60 + (i + 1)) / 4);
      }
    }
    return brmbrms;
  }

  return (
    <div className="App">
      <h1>BrmBrm Counter Web Application</h1>
      <p>This application will count how many times did Viktor say "brmbrm" up until, and including, the chosen date.</p>
      <p>Please enter the date:</p>
      <Calendar className="calendar" onChange={writeDateHandler}/>
      <p>{outputText}</p>
    </div>
  );
}

export default App;
