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
      if (data.cod === '404' || data.length === 0) {
        reject(data)
      } else {
        resolve(data)
      }
    })
  })
}