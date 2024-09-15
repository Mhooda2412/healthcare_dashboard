import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Loader from './Loader';

const EnrollmentPlanSplit = ({ data }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);

    useEffect(() => {
        if (data && data.length > 0) {
            // Find the latest month in the data
            const latestMonth = Math.max(...data.map(d => parseInt(d.month)));
            // Filter data for the latest month
            const filteredData = data.filter(d => parseInt(d.month) === latestMonth);
            // Sort data by enrollment and take top 10
            const sortedData = filteredData.sort((a, b) => b.total_enrollment - a.total_enrollment).slice(0, 10);

            // Update chart options and series
            setChartOptions({
                chart: {
                    type: 'bar',
                    toolbar: { show: false }
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        endingShape: 'rounded'
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: '#ffffff',
                            fontFamily: 'Karla, Helvetica, sans-serif',
                            fontSize: '12px',
                        },
                    },
                },
                xaxis: {
                    categories: sortedData.map(plan => plan.plan_type),
                    labels: {
                        formatter: function (value) {
                            return value + 'K'; // Convert to thousands
                        },
                        style: {
                            colors: '#ffffff',
                            fontFamily: 'Karla, Helvetica, sans-serif',
                            fontSize: '12px',
                        },
                    }
                },
                tooltip: {
                    y: {
                        formatter: (value) => `${value.toFixed(2)}K` // Adjusted precision
                    },
                },
                fill: {
                    colors: ['#29e6c0']
                },
                dataLabels: {
                    formatter: (value) => `${value.toFixed(2)}K`, // Displaying with 2 decimal points in thousands
                    enabled: true,
                    style: {
                        fontSize: '14px',
                        colors: ['#ffffff'], // Black labels
                        fontFamily: 'Karla, Helvetica, sans-serif'
                    }
                },
            });

            setChartSeries([{
                name: 'Plans by Enrollment',
                data: sortedData.map(plan => plan.total_enrollment / 1_000) // Convert to thousands
            }]);

            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-full bg-grey shadow-lg rounded-lg p-4">
                <Loader />
            </div>
        );
    }

    if (!chartSeries || chartSeries.length === 0) {
        return (
            <div className="overflow-hidden w-full h-full bg-grey shadow-lg rounded-lg p-4">
                <h2>Plans by Enrollment</h2>
                <p>No data available to display.</p>
            </div>
        );
    }

    return (
        <div className="bg-dark-blue shadow-lg rounded-lg p-4">
            <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={405}
            />
        </div>
    );
};

export default EnrollmentPlanSplit;
