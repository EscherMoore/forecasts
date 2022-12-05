import Layout from '../components/layout'
import { Forecast } from '../components/weather-chart'
import { getWeatherData } from '../lib/forecast'
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
                    return <Forecast key={weatherData['city'] + ', ' + weatherData['country']} weatherData={weatherData} />
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

    if (Object.keys(userSaveData).length === 0 ) {
        return { props: { session, savedWeatherData: [] } }
    }

    const savedWeatherData = await Promise.all(userSaveData.map(async (saves) => {
        return await getWeatherData(saves['name'])
    }))

    return { props: { session, savedWeatherData } }
}