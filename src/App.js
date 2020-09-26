import React,{useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [weatherData,setWeatherData]=useState(null);
  useEffect(()=>{
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=Ternopil&units=metric&appid=427f6d4f0d2bfadcc956f6ce714b2d52`)
        .then(res => {
          const info = res.data;
          console.log(info);
          setWeatherData(info);
        })
  },[]);
  return (
    <div>
      <label htmlFor="city">Enter your city</label>
      <input name="city" type="text"></input>
  {
    weatherData?
    <h1>{weatherData.name}</h1>:
    <h1>Loading</h1>
  }
  </div>
  );
}

export default App;
