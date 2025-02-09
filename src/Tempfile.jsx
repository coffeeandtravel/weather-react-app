import "./App.css";
import Cloud from './assets/Cloud.svg';
import Sun from './assets/Sun.svg';
import Rain from './assets/Rain.svg';
import Snow from './assets/Snow.svg';
import Drizzle from './assets/Drizzle.svg';
import Thunder from './assets/Thunder.svg';
import UP from './assets/Arrow-up.svg';
import DOWN from './assets/Arrow-down.svg';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hover from "./assets/Hover";

const API_KEY = "c52491d1e033e9c5ef2f8068bad990cf";

function Tempfile() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter" && city.trim() !== "") {
      try {
        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
        const geoData = await geoResponse.json();
        if (geoData.length === 0) {
          console.log("City not found! Enter a valid city.");
          return;
        }

        const { lat, lon } = geoData[0];
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const weatherJson = await weatherResponse.json();
        setWeatherData(weatherJson);

        const weatherMain = weatherJson.weather[0].main;
        let icon = Sun;
        if (weatherMain === "Clouds") icon = Cloud;
        else if (weatherMain === "Rain") icon = Rain;
        else if (weatherMain === "Snow") icon = Snow;
        else if (weatherMain === "Drizzle") icon = Drizzle;
        else if (weatherMain === "Thunderstorm") icon = Thunder;

        setWeatherIcon(icon);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Hover />
      <div className="h-screen w-screen flex flex-col items-center">
        <div className="h-16 w-1/2 navbar items-center justify-between flex flex-row rounded-full mt-7">
          <a className="items-center flex flex-row" href="#">
            <img src={Cloud} alt="" className="ml-5 mx-2" />
            <h1 className="text-2xl mx-2 text-white">SIMPLE WEATHER</h1>
          </a>
          <div className="mr-2">
            <input 
              type="text" 
              className="w-4/4 h-13 search text-2xl rounded-full pl-4 " 
              value={city} 
              placeholder="Search" 
              onChange={handleChange} 
              onKeyDown={handleKeyPress} 
            />
          </div>
        </div>
        
        {weatherData ? (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={weatherIcon}
                src={weatherIcon}
                alt="Weather Icon"
                className="h-48 w-48 mt-10"
                initial={{ x: "100vw", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100vw", opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>

            <div className="flex flex-row justify-center text-white mt-5">
              <div className="flex flex-col text-center justify-center">
                <h2 className="text-5xl">{weatherData.weather[0].main}</h2>
                <h3 className="my-5 text-4xl">{`${weatherData.main.temp}°C`}</h3>
              </div>
            </div>

            <div className="flex justify-center">
              <h1 className="text-5xl text-white">{weatherData.name}</h1>
            </div>

            <div className="flex justify-center mt-5">
              <div className="container h-20 w-1/2 rounded-3xl flex justify-between items-center">
                <div className="ml-4 flex flex-row items-center">
                  <img src={UP} alt="" />
                  <p className="text-white text-2xl items-center ml-1">{`${weatherData.main.temp_max}°C Max`}</p>
                </div>
                <div className="flex flex-row items-center mr-5">
                  <img src={DOWN} alt="" />
                  <p className="text-white text-2xl items-center ml-3">{`${weatherData.main.temp_min}°C Min`}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <h2 className="text-white text-5xl flex items-center justify-center h-full">Enter location to get started</h2>
        )}
      </div>
    </>
  );
}

export default Tempfile;
