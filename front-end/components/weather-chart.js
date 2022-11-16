import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'
import {hourlyTemperature, hourlyTime} from '../lib/hourly'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


export default function WeatherChart({ weatherData, hours=12 }) {

    if (typeof Highcharts === 'object') {
        HighchartsExporting(Highcharts)
    }

    const options = {
    chart: {
        type: 'line',
        borderColor: '#d3d3d3',
        borderWidth: 1,
    },
    legend: { enabled:false},
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
        line: {
            dataLabels: {
                enabled: true,
                format: '{y}°F'
            },
            enableMouseTracking: true
        }
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
          <Tab tabClassName="chart-tab" eventKey="6-hour" title="6 Hours">
            <WeatherChart weatherData={weatherData} hours={6} />
          </Tab>
          <Tab tabClassName="chart-tab" eventKey="12-hour" title="12 Hours">
            <WeatherChart weatherData={weatherData} hours={12} />
          </Tab>
          <Tab tabClassName="chart-tab" eventKey="24-hour" title="24 Hours">
            <WeatherChart weatherData={weatherData} hours={24} />
          </Tab>
        </Tabs>
      );
}