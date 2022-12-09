export function getUserSaveData(accessToken) { 
  const token = 'Token ' + accessToken.toString()

  return new Promise((resolve, reject) => {
    fetch('http://localhost:8000' + '/saves', {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data) {
        resolve(data)
      } else {
        reject(data)
      }
    })
  })
}


export async function saveForecast(accessToken, forecastData) {
  const token = 'Token ' + accessToken.toString()

  return new Promise((resolve, reject) => {
    fetch('http://localhost:8000' + '/saves/', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formatted_address: forecastData['formatted_address']
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data) {
        resolve(data)
      } else {
        reject(data)
      }
    })
  });
}