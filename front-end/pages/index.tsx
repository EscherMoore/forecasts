import {Forecast} from '../components/weather-chart'
import Layout from '../components/layout'
import { getForecast } from '../lib/forecast'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from "framer-motion"

export default function Home() {

  const [defaultData, setDefaultData] = useState(null)

  useEffect(() => {
    const getDefaultData = async () => {

      const forecasts = {
        NewYork: await getForecast('Manhattan, New York, NY, USA'),
        Tokyo: await getForecast('Tokyo, Japan'),
        London: await getForecast('London, UK')
      }
      setDefaultData(forecasts)
      return forecasts
    }
    return getDefaultData
  }, [])

  return (
    <Layout>
      <AnimatePresence mode='popLayout'>
        {defaultData ?
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            {Object.keys(defaultData).map((location, index) => {
              return (
                <motion.div
                    layout
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                        layout: {
                            type: "spring",
                            bounce: 0.2,
                            duration: index * 0.3 + 0.8,
                        },
                    }}
                >
                  <Forecast weatherData={defaultData[location]} />
                </motion.div>
              )
            })}
          </motion.div>
        :
          <h5 className="message">Loading...</h5>
        }
      </AnimatePresence>
    </Layout>
  )
}