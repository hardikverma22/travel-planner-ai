import { CountryCode } from "./CountryCode";
import { Coordinate } from "./Unit";
import { WeatherCondition } from "./WeatherConditions";


export interface Weather {
    id: WeatherCondition;
    main: string;
    description: string;
    icon: string;
}

// Internal Value for the API, its not 100% clear what value this could be. 2 Definitive values are 'stations' and 'cities' rn
export type Base = 'stations' | 'cities' | string;

export interface Main {
    temp: number;
    feels_like: number;
    pressure: number; // Pressure in hPa
    humidity: number; // in %
    temp_min: number; // Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
    temp_max: number;
    sea_level: number; // Pressure in hPa at sea_level
    grnd_level: number; // Pressure in hPa at grnd_level
}

export type Visibility = number;

export interface Wind {
    speed: number; // Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
    deg: number; // Wind direction, degrees (meteorological)
    gust?: number; // Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
}

export interface Clouds {
    all: number; // Cloudiness, %
}

export interface ForecastPrecipitation {
    '3h': number; // Rain volume for the last 3 hours, mm
}

export interface Precipitation extends ForecastPrecipitation {
    '1h'?: number; // Rain volume for the last 1 hour, mm
}

// Time of data calculation, unix, UTC#
export type Time = number;



export type CityId = number;

export interface City {
    id: CityId;
    name: string;
    coord: Coordinate;
    country: CountryCode;
    population: number;
    timezone: number; // Shift in seconds from UTC
    sunrise: Time; // Sunrise time, unix, UTC
    sunset: Time; // Sunset time, unix, UTC
}