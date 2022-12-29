import Link from 'next/link';
import { Button, Container, Form, Navbar, Nav, InputGroup } from 'react-bootstrap/'
import { Forecast } from '../components/weather-chart'
import { getForecast } from '../lib/forecast'
import { useContext } from "react";
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter, withRouter } from 'next/router';
import Image from 'next/image'
import { saveForecast } from '../lib/user'
import { UserContext, SearchContext } from '../pages/_app';
import { Formik } from 'formik'
import { object, string } from 'yup';
import { AnimatePresence, motion } from "framer-motion"
import Alert from 'react-bootstrap/Alert';
import { frontend_server } from '../config';


function Layout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const currentRoute = router.pathname;

    const search = useContext(SearchContext);
    const user = useContext(UserContext);

    const schema = object().shape({
        searchterm: string()
            .max(80, 'This Location Is Too Long... Try Something Shorter.')
    });

    const handleClear = (event) => {
        event.preventDefault()

        // Disable button to prevent duplicate clears
        event.target.disabled = true
        search.setForecast(forecast => ({...forecast, display: false, data: []}))
    }

    const handleSave = async (event) => {
        event.preventDefault()

        // Disable button to prevent duplicate saves
        event.target.disabled = true
        const saveButtonTimeout = 5500
        {setTimeout(() => {
            event.target.disabled = false
        }, saveButtonTimeout)}

        // Save to the database
        const savedForecast = await saveForecast(session['accessToken'], search.forecast.data['formatted_address'])

        if (savedForecast.id) {
            if (currentRoute === "/saved" && savedForecast) {
                // Update saves manually via State

                const newSaveWeatherData = await getForecast(savedForecast['formatted_address'])
                newSaveWeatherData['id'] = savedForecast['id']
                user.setSaveData((updatedSaveData) => ([newSaveWeatherData, ...user.saveData]));

                setTimeout(() => {
                    search.setForecast({ display: false, data: []})
                }, 350)
            } else {
                // Update saves via useEffect on page transition
                search.setForecast({ display: false, data: []})
                router.push('/saved/');
            }
        } else {
            search.setForecast(forecast => ({...forecast, errorMsg: 'You have reached the max number of saves!'}))
        }
    }

    return (
        <>
            <Navbar collapseOnSelect variant="dark" expand="lg">
                <Container>        
                    {status === "authenticated" ? 
                        <>
                            <Navbar.Collapse> 
                                <Link href="/">
                                    <Navbar.Brand 
                                        className={currentRoute == "/" ? "nav-active" : "nav-inactive"}
                                    >Home</Navbar.Brand>
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
                                    onClick={() => signOut({ callbackUrl: frontend_server})}
                                >Sign out</Button>
                            </Nav>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        </>
                    :
                        <>
                            <Link href="/">
                                <Navbar.Brand 
                                    className={currentRoute == "/" ? "nav-active" : "nav-inactive"}
                                >Home</Navbar.Brand>
                            </Link>
                            <Nav className="ml-auto">
                                <Button 
                                    className="mt-3 mb-3 btn btn-primary btn-sm"
                                    onClick={() => signIn('google', { callbackUrl: frontend_server + '/saved' })}
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
                                search.setForecast(forecast => ({...forecast, display: true, data: searchedForecast}))
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
                                <Button className="rounded btn btn-primary" type="submit">Search</Button>
                                <Form.Control.Feedback type="invalid">{errors.searchterm}</Form.Control.Feedback>
                            </InputGroup>
                        </Form>
                    )}
                    </Formik>
                    <AnimatePresence mode='popLayout'>
                        { search.forecast.display === true ?
                            <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{
                                    layout: {
                                        type: "spring",
                                        bounce: 0.2,
                                        duration: 0.8,
                                    },
                                    opacity: {
                                        duration: 0.7
                                    },
                                }}
                            >
                                <Forecast weatherData={search.forecast.data} />
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
                            </motion.div>
                        :
                            null
                        }
                    </AnimatePresence>
                    <AnimatePresence mode='popLayout'>
                        { search.forecast.errorMsg ?
                            <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{
                                    layout: {
                                        type: "spring",
                                        bounce: 0.2,
                                        duration: 0.8,
                                    },
                                    opacity: {
                                        duration: 0.3
                                    },
                                    scale: {
                                        duration: 0.3
                                    }
                                }}
                            >
                                {setTimeout(() => {
                                    search.setForecast(forecast => ({...forecast, errorMsg: ''}))
                                }, 5000)}
                                <Alert variant='danger'>{search.forecast.errorMsg}</Alert>
                            </motion.div>
                        :
                            null
                        }
                    </AnimatePresence>
                    { children }
                </main>
            </Container>
        </>
    );
}
export default withRouter(Layout);