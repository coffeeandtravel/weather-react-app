import "./App.css";
import Cloud from "./assets/Cloud.svg";
import Sun from "./assets/Sun.svg";
import Rain from "./assets/Rain.svg";
import Snow from "./assets/Snow.svg";
import Drizzle from "./assets/Drizzle.svg";
import Thunder from "./assets/Thunder.svg";
import Humiditiy from "./assets/Humiditiy.svg";
import Air from "./assets/Air.svg";
import Moon from "./assets/Moon.svg";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hover from "./assets/Hover";
import SearchIcon from "./assets/Search.svg"

const API_KEY = import.meta.env.VITE_API_KEY;
// console.log(API_KEY);


function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  useEffect(() => {
    if (weatherData && weatherData.name) {
      document.title = `Weather - ${weatherData.name}`;
    }
  }, [weatherData]);


  const handleChange = (event) => {
    setCity(event.target.value);
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter" && city.trim() !== "") {
      try {
        const geoResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );

        const geoData = await geoResponse.json();
        if (geoData.length === 0) {
          console.log("City not found enter a valid city!");
          return;
        }

        const { lat, lon } = geoData[0];
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const weatherJson = await weatherResponse.json();
        setWeatherData(weatherJson);
        const weatherMain = weatherJson.weather[0].main;

        const currentTime = weatherJson.dt; // Current timestamp
        const sunrise = weatherJson.sys.sunrise; // Sunrise timestamp
        const sunset = weatherJson.sys.sunset;

        const isNight = currentTime < sunrise || currentTime > sunset;

        let icon = Sun;
        if (isNight) icon = Moon;
        if (weatherMain == "Clouds") icon = Cloud;
        if (weatherMain == "Rain") icon = Rain;
        if (weatherMain == "Snow") icon = Snow;
        if (weatherMain == "Drizzle") icon = Drizzle;
        if (weatherMain == "Thuderstorm") icon = Thunder;

        setWeatherIcon(icon);
        setIsSearchOpen(false);

        // console.log(weatherJson);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Hover />
      <div className="h-screen w-screen">
        {/* Navbar */}
        <div className="flex justify-center">
          <div className="h-16 w-300 navbar items-center justify-between flex flex-row rounded-full mt-7">
            <a className="items-center flex flex-row" href="#">
              <img src={Cloud} alt="" className=" ml-5 mx-2" />
              <h1 className="text-2xl mx-2 text-white" href="#">
                SIMPLE WEATHER
              </h1>
            </a>
            <div className="mr-2 hidden md:block">
              <input
                type="text"
                className="w-150 h-13 search text-2xl rounded-full pl-4 "
                value={city}
                placeholder="Search"
                onChange={handleChange}
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-18 lg:mt-10 ">
          {/* <img src={Sun} alt="" className="h-48 w-48 " /> */}
          {weatherData ? (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={weatherIcon}
                  src={weatherIcon}
                  alt={weatherData.name}
                  className="h-48 w-48  mt-5"
                  initial={{ x: "100vw", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100vw", opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
            </>
          ) : (
            <h2 className="text-white text-5xl sm:pl-5 mt-60  mb-20 flex items-center sm:align:left align-center justify-center h-full">
              Enter location to get started
            </h2>
          )}
        </div>

        <div>
          <div>
            <div className="flex flex-row justify-center text-white  mt-14 lg:mt-5">
              {weatherData && (
                <div className="flex flex-col text-center justify-center">
                  <h2 className="text-5xl">{weatherData.weather[0].main}</h2>
                  <h3 className="my-5 text-4xl">{`${Math.floor(weatherData.main.temp)}°C`}</h3>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              {weatherData && (
                <div className="flex">
                <h1 className="text-5xl text-white">{weatherData.name}</h1>
              </div>
              )}
              
            </div>
            {weatherData && (<div className=" flex justify-center mt-5 lg:mt-7">
              <div className="container h-20 w-100 sm:w-100 rounded-3xl flex justify-between items-center">
                <div className="ml-4 flex flex-row items-center">
                  <img src={Humiditiy} alt="" />
                  {weatherData && (<p className="text-white text-2xl items-center ml-1">
                    {`${Math.floor(weatherData.main.humidity)}`} %
                  </p>)}
                  
                </div>
                <div className="flex flex-row items-center mr-5">
                  <img src={Air} alt="" />
                  {weatherData && (<p className="text-white text-2xl items-center ml-3">
                    {`${Math.floor(weatherData.wind.speed)}`} Kmph
                  </p>)}
                  
                </div>
              </div>
            </div>)}
            

          </div>
        </div>
       
      </div>
      <div className="md:hidden">
          {isSearchOpen && (
            <motion.div
              className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-4/5 navbar text-white rounded-full shadow-lg flex items-center p-3"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <input
                type="text"
                className="w-full px-4 py-2 text-lg rounded-full outline-none"
                value={city}
                placeholder="Enter city..."
                onChange={handleChange}
                onKeyDown={handleKeyPress}
              />
            </motion.div>
          )}
          <motion.button
            className="fixed bottom-35 right-5 transform-translate-x-1/2 navbar text-white bg-amber-400 h-20 w-20 flex items-center text-center justify-center rounded-full shadow-lg"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
          >
            <img src={SearchIcon} alt="Search" className="h-6 w-6" />
          </motion.button>
        </div>
      {/* <Tempfile/> */}
    </>
  );
}

export default App;
