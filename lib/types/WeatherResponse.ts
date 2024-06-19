// 20200516233806
// https://openweathermap.org/data/2.5/weather?q=London,uk&appid=439d4b804bc8187953eb36d2a8c26a02

import { CountryCode } from "./CountryCode";
import { Coordinate } from "./Unit";
import { Base, Clouds, Main, Precipitation, Weather, Wind, Time } from "./Support";


export interface CurrentWeatherSys {
    type?: number; // Internal parameter
    id?: number; // Internal parameter
    message?: number; // Internal parameter
    country: CountryCode; // Country code (GB, JP etc.)
    sunrise: Time; // Sunrise time, unix, UTC
    sunset: Time; // Sunset time, unix, UTC
}

export interface CurrentWeatherResponse {
    coord: Coordinate;
    weather: Weather[];
    base: Base;
    main: Main;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    rain?: Precipitation;
    snow?: Precipitation;
    dt: number;
    sys: CurrentWeatherSys;
    timezone: number; // 
    id: number; // City-ID
    name: string; // City Name
    cod: number; // Internal parameter
}

// The Name CurrentResponse is subjectivley not a good name to use, but should be kept for backwards compatibility
export interface CurrentResponse extends CurrentWeatherResponse { }