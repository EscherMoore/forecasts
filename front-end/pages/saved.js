import Layout from '../components/layout'
import { Forecast } from '../components/weather-chart'
import { deleteForecast } from '../lib/user'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import { useContext } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from 'react-bootstrap/'
import { UserContext } from '../pages/_app'

export default function Saved() {
    const { data: session, status } = useSession();

    const user = useContext(UserContext)

    const handleDelete = async (event) => {
        event.preventDefault()

        // Disable button to prevent duplicate delete requests
        event.target.disabled = true

        // Delete from the backend
        await deleteForecast(session.accessToken, event.target.value)

        // Delete from the frontend
        user.setSaveData(user.saveData.filter(function (save) {
            return save['id'] != event.target.value
        }));

        // Re-enable the button to prevent unexpected behavior with other delete buttons
        event.target.disabled = false
    }

    if (user.saveData && user.saveData.length > 0) {
        return (
            <Layout>
                {user.saveData.map((weatherData) => {
                    return (
                        <>
                            <Forecast key={weatherData['id']} weatherData={weatherData} />
                            <div className="mt-1">
                                <Button onClick={handleDelete} value={weatherData['id']} className="btn btn-primary" type="submit">Delete</Button>
                            </div>
                        </>
                    )
                })}
            </Layout>
        )
    } else if (user.saveData && user.saveData.length === 0) {
        return (
            <Layout>
                <h5 className="message">You don't have any save data...</h5>
            </Layout>
        )
    } else {
        return (
            <Layout>
                <h5 className="message">Loading...</h5>
            </Layout>
        )
    }
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
    
    return { props: session }
}