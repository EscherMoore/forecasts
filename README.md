<br />
<div align="center">
  <a href="https://github.com/EscherMoore/forecasts">
    <img src="front-end/public/images/umbrella.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Forecasts</h3>

  <p align="center">
    An elegant Single-page application for viewing weather forecasts built using NextJS + Django REST Framework.
    <br />
    <a href="https://forecasts.eschermoore.com"><strong>Go to site »</strong></a>
    <br />
    <br />
    <a href="#about-the-project">About the Project</a>
    ·
    <a href="https://github.com/EscherMoore/forecasts/issues/new">Report Bug</a>
    ·
    <a href="#contact">Contact</a>
    <br />
    <br />
    If you like this Project give it a :star: on GitHub!
  </p>
</div>


<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#deployed-with">Deployed With</a></li>
        <li><a href="#features">Features</a></li>
      </ul>
    </li> 
    <li><a href="#credits">Credits</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>


<video preload="none" autoplay loop muted playsinline width="100%" height="100%">
    <source src="forecasts.mp4" type="video/mp4">
</video>

## About The Project
Through the use of the [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding) and weather data pulled from [openweathermap.org](https://openweathermap.org/), users are able to search for nearly any place in the world and view a real time forecast for the searched location with the hourly temperature displayed using line charts. Creating an account is as simple as connecting your Google account to the app via the OAuth protocol. By signing in with Google, a user profile is saved to the app's PostgreSQL database using the Google resources granted to the app by the user (name, email address, language preference, and profile picture). With a newly created account, users gain the ability to save up to 5 locations of their choice for quick and easy forecast viewing in future visits.

<br />

### Built With

* ![JavaScript][JavaScript]
* [![Next][Next.js]][Next-url]
* ![Python][Python]
* [![DjangoREST][DjangoREST]][DjangoREST-url]
* ![CSS3][CSS3]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]

<br />

### Deployed With
* [![Vercel][Vercel]][Vercel-url]
* [![Heroku][Heroku]][Heroku-url]
* ![Postgres][Postgres]

<br />

### Features

* Search for weather forecasts for any location that you can find on Google Maps.
* Get the next 24 hours of hourly temperature forecasts for your searched locations.
* Sign up for an account using your existing Google account.
* With an account created, save up to 5 locations of your choice to view at any time!

<br />

## Credits 
* [OpenWeather API](https://openweathermap.org/)
* [Google Maps Geocoding AP](https://developers.google.com/maps/documentation/geocoding)
* [Framer Motion](https://www.framer.com/motion/)
* [Formik](https://formik.org/)
* [Yup](https://github.com/jquense/yup) 
* [highcharts-react-official](https://github.com/highcharts/highcharts-react)
* [react-bootstrap](https://react-bootstrap.github.io/)
* [NextAuth.js](https://next-auth.js.org/)
* [django-allauth](https://django-allauth.readthedocs.io/en/latest/)

<br />

## Contact

Escher Moore - [Email Me](https://eschermoore.com/contact) 

Project Website: [https://forecasts.eschermoore.com](https://forecasts.eschermoore.com)

<br />

## License

The default copyright laws apply, meaning I retain all rights to the source code and no one may reproduce, distribute, or create derivative works from my work.
See Github: [Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository#choosing-the-right-license) for more information.

<br />

[project-screenshot]: forecasts.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[DjangoREST]: https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray
[DjangoREST-url]: https://www.django-rest-framework.org/
[Python]: https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54
[Python-url]: https://www.python.org/
[JavaScript]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[CSS3]: https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white
[Postgres]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[Vercel]: https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com/
[Heroku]: https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white
[Heroku-url]: https://www.heroku.com/