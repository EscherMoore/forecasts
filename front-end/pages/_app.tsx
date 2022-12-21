import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import type { AppProps } from 'next/app'
import { SessionProvider, useSession, getSession } from "next-auth/react"
import { SSRProvider } from 'react-bootstrap';
import { useState, useEffect, createContext } from "react";
import { getUserSaveData } from '../lib/user'
import { getForecast } from '../lib/forecast'


export const SearchContext = createContext();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {

  const [forecast, setForecast] = useState({
      display: false,
      data: '',
      errorMsg: '',
  });

  return (
    <SSRProvider>
      <SessionProvider session={session}>
        <SearchContext.Provider value={{forecast, setForecast}}>
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

export const UserContext = createContext();

function Auth({ children }) {

  const { status } = useSession({ required: true })

  const [saveData, setSaveData] = useState(null);

  useEffect(() => {
    const weatherData = async () => {
        loadUserSaves()
    }
    return weatherData
  }, [])

  const loadUserSaves = async () => {
      const session = await getSession()
      const userSaveData = await getUserSaveData(session.accessToken)
      const savedWeatherData = await Promise.all(userSaveData.map(async (saves) => {
          let savedForecast = await getForecast(saves['formatted_address'])

          savedForecast['id'] = saves['id']
          return savedForecast
      }))
      setSaveData(savedWeatherData)
      return userSaveData
  };

  if (status === "loading") {
    return <h5 className="message">Loading...</h5>
  }

  return (
    <UserContext.Provider value={{saveData, setSaveData}}>
      {children}
    </UserContext.Provider>
  )
}