import Head from 'next/head'
import Link from 'next/link';
import { Button, Container, Form, Navbar, Nav } from 'react-bootstrap/'
import { Forecast } from '../components/weather-chart'
import { getWeatherData } from '../lib/forecast'
import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import Image from 'next/image'

export default function Layout({ children }) {

    const { data: session, status } = useSession();
    const router = useRouter();
    const currentRoute = router.pathname;

    const [forecast, setForecast] = useState({
        display: false,
        data: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault()
        setForecast({ display: true, data: await getWeatherData(event.target.name.value)})
        event.target.name.value = ""
    }

    return (
        <>
            <Head>
                <title>Forecasts</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar collapseOnSelect expand="lg">
                <Container>        
                    {status === "authenticated" ? 
                        <>
                            <Navbar.Collapse> 
                                <Link href="/">
                                    <Navbar.Brand 
                                        className={currentRoute == "/" ? "nav-active" : "nav-inactive"}
                                    >Forecasts</Navbar.Brand> 
                                </Link>
                                <Nav className="ml-auto">
                                    <Link href="/saved"
                                        className={currentRoute.includes("/saved") ? "nav-active" : "nav-inactive"}
                                    >Saved</Link>
                                </Nav>
                            </Navbar.Collapse> 
                            <Nav className="ml-auto profile-info">
                                <Nav.Item>
                                    <Image 
                                        src={session.user.image} 
                                        className="profile-picture"
                                        width={35} 
                                        height={35} 
                                        alt={"Profile Picture"}
                                    />
                                </Nav.Item>
                            </Nav>
                            <Nav className="ml-auto profile-info">
                                <Nav.Item className="profile-username">
                                    {session.user.name}
                                </Nav.Item>
                            </Nav>
                            <Nav className="ml-auto">
                                <Button 
                                    className="btn btn-primary btn-sm" 
                                    onClick={() => signOut({ callbackUrl: 'http://localhost:3000/'})}
                                >Sign out</Button>
                            </Nav>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        </>
                    :
                        <>
                            <Link href="/">
                                <Navbar.Brand 
                                    className={currentRoute == "/" ? "nav-active" : "nav-inactive"}
                                >Forecasts</Navbar.Brand> 
                            </Link>
                            <Nav className="ml-auto">
                                <Button 
                                    className="btn btn-primary btn-sm" 
                                    onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000/saved' })}
                                >Sign in with Google</Button>
                            </Nav>
                        </>
                    }
                </Container>
            </Navbar>
            <Container>
                <main>
                    <Form 
                        onSubmit={handleSubmit}
                        className="d-flex g-3"
                    >
                        <Form.Control
                            name="name"
                            type="search"
                            placeholder="Enter a City (optional: State, Country code) Or Zip code"
                            className="me-2 shadow-none"
                            aria-label="Search"
                            required
                            spellCheck="off"
                            autoComplete="off"
                        />
                        <Button className="btn btn-primary" type="submit">Search</Button>
                    </Form>
                    { forecast.display === true ? <Forecast weatherData={forecast.data} /> : null }
                    { children }
                </main>
            </Container>
        </>
    );
}