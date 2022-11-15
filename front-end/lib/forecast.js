import {server} from '../config'

export function getWeatherData(location) { 
  return new Promise((resolve, reject) => {
    fetch(server + '/forecast?location=' + location)
    .then(response => response.json())
    .then(data => {
      if (data.cod === '404' || data.length === 0) {
        reject(data)
      } else {
        resolve(data)
      }
    })
  })
}