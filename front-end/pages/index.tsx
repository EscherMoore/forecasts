import {Forecast} from '../components/weather-chart'
import Layout from '../components/layout'
import { getWeatherData } from '../lib/forecast'


export default function Home({ weatherData }) {
  return (
    <Layout>
      <Forecast weatherData={weatherData.NewYork} />
    </Layout>
  )
}

export async function getServerSideProps() {
  var weatherData = {
    NewYork: await getWeatherData('10005'),

    /*
    Tokyo: await getWeatherData('Tokyo, JP'),
    London: await getWeatherData('London, GB')
    */
  }

  return { props: { weatherData } }
}