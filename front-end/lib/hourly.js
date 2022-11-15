import { unixTimeConverter } from './convert-unixtime'

export function hourlyTime(hourlyWeatherData, hours) {
    if (hours > 48) {
      hours = 48
    }
    hours = hours - 1;
    const time = ['Now'];
    for (const hour in hourlyWeatherData) {
      if (hour > 0 && hour <= hours) {
         time.push(unixTimeConverter(hourlyWeatherData[hour].dt));
      }
    }
    return time 
}
  

export function hourlyTemperature(hourlyWeatherData, hours) {
    if (hours > 48) {
      hours = 48
    }
    hours = hours - 1;
    const temperature = [];
    for (const hour in hourlyWeatherData) {
      if (hour <= hours) { 
        temperature.push(Math.round(hourlyWeatherData[hour].temp))
      }
    }
    return temperature
}