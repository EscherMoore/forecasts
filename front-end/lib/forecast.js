export function getForecast(location) {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:8000' + '/forecast?location=' + location)
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