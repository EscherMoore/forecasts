import WeatherChart from '../components/weather-chart'
import Layout from '../components/layout'
import { getWeatherData } from '../lib/forecast'


export default function Home({ weatherData }) {
  return (
    <Layout>
      <WeatherChart weatherData={weatherData} />
    </Layout>
  )
}

export async function getServerSideProps() {
  const weatherData = await getWeatherData('London, GB')
  return { props: { weatherData } }
}