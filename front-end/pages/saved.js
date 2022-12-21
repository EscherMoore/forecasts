import Layout from '../components/layout'
import { Forecast } from '../components/weather-chart'
import { deleteForecast } from '../lib/user'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import { useContext } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from 'react-bootstrap/'
import { UserContext } from '../pages/_app'
import { AnimatePresence, motion } from "framer-motion"


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
    }

    if (user.saveData) {
        return (
            <Layout>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                >
                    <AnimatePresence mode='popLayout'>
                        {user.saveData.length > 0 ?
                            <motion.div
                                key="has-saves"
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                exit={{ opacity: 0, scale: 0.5 }}
                            >
                                <AnimatePresence mode='popLayout'>
                                    {user.saveData.map((weatherData, index) => {
                                        return (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0 }}
                                                key={weatherData['id']}
                                                animate={{ opacity: 1}}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{
                                                    layout: {
                                                        type: "spring",
                                                        bounce: 0.2,
                                                        duration: index * 0.3 + 0.8,
                                                    },
                                                    opacity: {
                                                        duration: 0.5
                                                    },
                                                }}
                                            >
                                                <Forecast
                                                    key={weatherData['id']}
                                                    weatherData={weatherData}
                                                />
                                                <div className="mt-1">
                                                    <Button
                                                        onClick={handleDelete}
                                                        value={weatherData['id']}
                                                        className="btn btn-primary"
                                                        type="submit"
                                                    >Delete</Button>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        :
                            <motion.div
                                key="no-saves"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.7, ease: 'easeInOut' }}
                                exit={{ opacity: 0 }}
                            >
                                <h5 className="message">You don't have any saved forecasts...</h5>
                            </motion.div>
                        }
                    </AnimatePresence>
                </motion.div>
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