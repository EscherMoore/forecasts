import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { SessionProvider, useSession, getSession } from "next-auth/react"
import { SSRProvider } from 'react-bootstrap';
import { useState, useEffect, createContext } from "react";
import { getUserSaveData } from '../lib/user'
import { getForecast } from '../lib/forecast'
import Head from 'next/head';

export const SearchContext = createContext({});


export default function App({ Component, pageProps, session }) {

  const [forecast, setForecast] = useState({
      display: false,
      data: '',
      errorMsg: '',
  });

  return (
    <SSRProvider>
      <SessionProvider session={session}>
        <SearchContext.Provider value={{forecast, setForecast}}>
        <Head>
          <title>Forecasts - Escher Moore</title>
          <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
          <link rel="manifest" href="/images/site.webmanifest" />
        </Head>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
        </SearchContext.Provider>
      </SessionProvider>
    </SSRProvider>
  )
}

export const UserContext = createContext({});

function Auth({ children }) {

  const { status } = useSession({ required: true })

  const [saveData, setSaveData] = useState(null);

  const weatherData = async () => {
      loadUserSaves()
  }

  useEffect(() => {
    weatherData()
  }, [])

  const loadUserSaves = async () => {
      const session = await getSession()
      const userSaveData = await getUserSaveData(session.accessToken)
      const savedWeatherData = await Promise.all(userSaveData.map(async (saves) => {
          const savedForecast = await getForecast(saves['formatted_address'])

          savedForecast['id'] = saves['id']
          return savedForecast
      }))
      setSaveData(savedWeatherData)
      return userSaveData
  };

  if (status === "loading") {
    return <h5 className="message">Authenticating...</h5>
  }

  return (
    <UserContext.Provider value={{saveData, setSaveData}}>
      {children}
    </UserContext.Provider>
  )
}