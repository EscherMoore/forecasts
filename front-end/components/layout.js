import Head from 'next/head'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import WeatherChart from '../components/weather-chart'
import { getWeatherData } from '../lib/forecast'
import { useState } from 'react'

export default function Layout({ children }) {

    const [chart, setChart] = useState({
        display: false,
        data: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault()
        setChart({ display: true, data: await getWeatherData(event.target.name.value)})
    }

    return (
        <>
            <Head>
                <title>Forecasts</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#">Forecasts</Navbar.Brand>
                    <Form 
                        onSubmit={handleSubmit}
                        className="d-flex"
                    >
                        <Form.Control
                            name="name"
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button className="btn btn-primary" type="submit">Search</Button>
                    </Form>
                </Container>
            </Navbar>
            <Container>
                <main>
                    { chart.display === true ? <WeatherChart weatherData={chart.data} hours={12} /> : null }
                    { children }
                </main>
            </Container>
        </>
    );
}