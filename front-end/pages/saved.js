import Layout from '../components/layout'
import { Forecast } from '../components/weather-chart'
import { getForecast } from '../lib/forecast'
import { getUserSaveData } from '../lib/user'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"


export default function Saved({ savedWeatherData }) { 

    return (
        <Layout>
            {savedWeatherData.length === 0 ? 
                <h5 className="no-save-data">You don't have any saves...</h5>
            :
                savedWeatherData.map((weatherData) => { 
                    return <Forecast key={weatherData['formatted_address']} weatherData={weatherData} />
                })
            }
        </Layout>
    )

}
Saved.auth = true


export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions)

    if (!session) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
    }
    
    const userSaveData = await getUserSaveData(session.accessToken)

    if (userSaveData.length === 0) {
        return { props: { session, savedWeatherData: userSaveData }}
    }

    const savedWeatherData = await Promise.all(userSaveData.map(async (saves) => {
        return await getForecast(saves['formatted_address'])
    }))

    return { props: { session, savedWeatherData } }
}