import {Forecast} from '../components/weather-chart'
import Layout from '../components/layout'
import { getForecast } from '../lib/forecast'


export default function Home({ weatherData }) {
  return (
    <Layout>
      <Forecast weatherData={weatherData.NewYork} />
    </Layout>
  )
}

export async function getServerSideProps() {
  var weatherData = {
    NewYork: await getForecast('Manhattan, New York, NY, USA'),
    Tokyo: await getForecast('Tokyo, Japan'),
    London: await getForecast('London, UK')
  }

  return { props: { weatherData } }
}