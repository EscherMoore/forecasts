import { backend_server } from "../config"

export function getForecast(location) {
  return new Promise((resolve, reject) => {
    fetch(backend_server + '/forecast?location=' + location)
    .then(response => response.json())
    .then(data => {
      if (data.cod === '404') {
        reject(data)
      } else {
        resolve(data)
      }
    })
  })
}