import {Forecast} from '../components/weather-chart'
import Layout from '../components/layout'
import { getForecast } from '../lib/forecast'
import { useState, useEffect } from 'react'


export default function Home() {

  const [defaultData, setDefaultData] = useState(null)

  useEffect(() => {
    const getDefaultData = async () => {
      const forecasts = {
        NewYork: await getForecast('Manhattan, New York, NY, USA'),
        /*
        Tokyo: await getForecast('Tokyo, Japan'),
        London: await getForecast('London, UK')
        */
      }
      setDefaultData(forecasts)
      return forecasts
    }
    return getDefaultData
  }, [])

  return (
    <Layout>
      {defaultData ?
        <>
          <Forecast weatherData={defaultData.NewYork} />
        </>
      :
        <h5 className="message">Loading...</h5>
      }
    </Layout>
  )
}