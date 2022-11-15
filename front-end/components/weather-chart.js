import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'
import {hourlyTemperature, hourlyTime} from '../lib/hourly'

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
        <div className="chart">
            <HighchartsReact 
                highcharts={Highcharts}
                options={options}
            />
        </div>
    )
}