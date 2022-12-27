import { backend_server } from "../config"

export function getUserSaveData(accessToken) { 
  const token = 'Token ' + accessToken.toString()

  return new Promise((resolve, reject) => {
    fetch(backend_server + '/saves', {
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
    fetch(backend_server + '/saves/', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formatted_address: formattedAddress
      })
    })
    .then(response => {
      if (response.status == 201) {
        return response.json()
      } else {
        resolve(response)
      }
    })
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
    fetch(backend_server + '/saves/' +  forecast_id + '/', {
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