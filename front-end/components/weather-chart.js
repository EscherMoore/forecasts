import Highcharts from 'highcharts'
import DarkUnica from 'highcharts/themes/dark-unica';
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'
import {hourlyTemperature, hourlyTime} from '../lib/hourly'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function WeatherChart({ weatherData, hours=12 }) {

    if (typeof Highcharts === 'object') {
        HighchartsExporting(Highcharts)
        DarkUnica(Highcharts)
    }

    const options = {
        chart: {
            type: 'line',
            borderColor: '#2B908F',
            borderWidth: 1,
            borderRadius: 5,
        },
        legend: { enabled: false },
        title: {
            text: weatherData.city + ', ' + weatherData.country
        },
        subtitle: {
            text: 'Source: openweathermap.org'
        },
        xAxis: {
            categories: hourlyTime(weatherData.hourly, hours),
        },
        yAxis: {
            title: {
                text: 'Temperature (°F)'
            }
        },
        tooltip: {
            pointFormat: '<span>{series.name}</span>: {point.y} °F<br/>',
        },
        plotOptions: {
            series: {
                animation: false
            },
            line: {
                dataLabels: {
                    enabled: true,
                    format: '{y}°F'
                },
                enableMouseTracking: true
            }
        },
        accessibility: {
            enabled: false
        },
        series: [{
            name: weatherData.city,
            data: hourlyTemperature(weatherData.hourly, hours),
        }]
    }

    return (
        <div>
            <HighchartsReact 
                highcharts={Highcharts}
                options={options}
            />
        </div>
    )
}


export function Forecast({ weatherData }) {
    return (
        <Tabs
          defaultActiveKey="6-hour"
          className="chart"
          variant="pills"
          fill
          justify
        >
          <Tab tabClassName="chart-tab btn-dark" eventKey="6-hour" title="6 Hours">
            <WeatherChart weatherData={weatherData} hours={6} />
          </Tab>
          <Tab tabClassName="chart-tab btn-dark" eventKey="12-hour" title="12 Hours">
            <WeatherChart weatherData={weatherData} hours={12} />
          </Tab>
          <Tab tabClassName="chart-tab btn-dark" eventKey="18-hour" title="18 Hours">
            <WeatherChart weatherData={weatherData} hours={18} />
          </Tab>
          <Tab tabClassName="chart-tab btn-dark" eventKey="24-hour" title="24 Hours">
            <WeatherChart weatherData={weatherData} hours={24} />
          </Tab>
        </Tabs>
      );
}