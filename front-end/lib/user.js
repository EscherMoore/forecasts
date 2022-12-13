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


export async function saveForecast(accessToken, formattedAddress) {
  const token = 'Token ' + accessToken.toString()

  return new Promise((resolve, reject) => {
    fetch('http://localhost:8000' + '/saves/', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formatted_address: formattedAddress
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


export async function deleteForecast(accessToken, forecast_id) {
  const token = 'Token ' + accessToken.toString()

  return new Promise((resolve, reject) => {
    fetch('http://localhost:8000' + '/saves/' +  forecast_id + '/', {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (response) {
        resolve(response)
      } else {
        reject(response)
      }
    });
  });
}