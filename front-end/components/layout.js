import Head from 'next/head'
import Link from 'next/link';
import { Button, Container, Form, Navbar, Nav, InputGroup } from 'react-bootstrap/'
import { Forecast } from '../components/weather-chart'
import { getForecast } from '../lib/forecast'
import { useState, useContext } from "react";
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter, withRouter } from 'next/router';
import Image from 'next/image'
import { saveForecast } from '../lib/user'
import { UserContext } from '../pages/_app';
import { Formik } from 'formik'
import { object, string } from 'yup';


function Layout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const currentRoute = router.pathname;

    const user = useContext(UserContext);

    const [forecast, setForecast] = useState({
        display: false,
        data: '',
    });

    const schema = object().shape({
        searchterm: string()
            .max(80, 'This Location Is Too Long... Try Something Shorter.')
    });

    const handleClear = (event) => {
        event.preventDefault()

        // Disable button to prevent duplicate clears
        event.target.disabled = true
        setForecast({ display: false, data: []})
    }

    const handleSave = async (event) => {
        event.preventDefault()

        // Disable button to prevent duplicate saves
        event.target.disabled = true

        // Save to the database
        const savedForecast = await saveForecast(session['accessToken'], forecast.data['formatted_address'])

        if (router.pathname === "/saved" && savedForecast) {
            // Update saves manually via State
            const newSaveWeatherData = await getForecast(savedForecast['formatted_address'])
            newSaveWeatherData['id'] = savedForecast['id']
            user.setSaveData((updatedSaveData) => ([newSaveWeatherData, ...user.saveData]));

            setForecast({ display: false, data: []})
        } else {
            // Update saves via useEffect on page transition
            router.push('/saved/');
        }
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
                                    className="mt-3 mb-3 btn btn-primary btn-sm"
                                    onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000/saved' })}
                                >Sign in with Google</Button>
                            </Nav>
                        </>
                    }
                </Container>
            </Navbar>
            <Container>
                <main>
                    <Formik
                        validationSchema={schema}
                        initialValues={{ searchterm: "" }}
                        onSubmit={async (values, { setErrors }) => {
                            const searchedForecast = await getForecast(values.searchterm)
                            values.searchterm = ""
                            if (searchedForecast.length == 0) {
                                setErrors({searchterm: 'That Location Does Not Exist.'})
                            } else {
                                setForecast({ display: true, data: searchedForecast})
                            }
                        }}
                    >
                    {({
                        values,
                        errors,
                        handleBlur,
                        handleSubmit,
                        handleChange}) => (
                        <Form
                            onSubmit={handleSubmit}
                        >
                            <InputGroup>
                                <Form.Control
                                    name="searchterm"
                                    type="search"
                                    placeholder="Search for a City, State, Zip, Country, Address, or Even a Place of Business"
                                    className="me-2 shadow-none rounded"
                                    aria-label="Search"
                                    value={values.searchterm}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    isInvalid={errors.searchterm}
                                    spellCheck="off"
                                    autoComplete="off"
                                />
                                <Button class="rounded btn btn-primary" type="submit">Search</Button>
                                <Form.Control.Feedback type="invalid">{errors.searchterm}</Form.Control.Feedback>
                            </InputGroup>
                        </Form>
                    )}
                    </Formik>
                    { forecast.display === true ?
                        <>
                            <Forecast weatherData={forecast.data} />
                            <div className="mt-1">
                                { status === "authenticated" ?
                                    <>
                                        <Button onClick={handleSave} className="btn btn-primary" type="submit">Save</Button>
                                        <Button onClick={handleClear} className="mx-1 btn btn-primary" type="submit">Clear</Button>
                                    </>
                                :
                                    <Button onClick={handleClear} className="btn btn-primary" type="submit">Clear</Button>
                                }
                            </div>
                        </>
                    :
                        null
                    }
                    { children }
                </main>
            </Container>
        </>
    );
}
export default withRouter(Layout);