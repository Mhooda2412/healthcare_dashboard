import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Loader from './Loader';

const EnrollmentGrowthChart = ({ data }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [displayPercentage, setDisplayPercentage] = useState(false);

    useEffect(() => {
        if (data?.length > 0) {
            
            const uniqueYears = Array.from(new Set(data.map(item => parseInt(item.year, 10)))).sort((a, b) => a - b);
            const latestYear = uniqueYears[uniqueYears.length - 1];

            const uniqueMonths = Array.from(new Set(data.filter(item => parseInt(item.year, 10) === latestYear).map(item => parseInt(item.month, 10)))).sort((a, b) => a - b);
            const latestMonth = uniqueMonths[uniqueMonths.length - 1];

            setFromDate(`${latestYear}-${String(uniqueMonths.length > 1 ? uniqueMonths[uniqueMonths.length - 2] : uniqueMonths[0]).padStart(2, '0')}`);
            setToDate(`${latestYear}-${String(latestMonth).padStart(2, '0')}`);

            const fromMonthData = data.filter(item => item.year === latestYear.toString() && item.month === (uniqueMonths.length > 1 ? String(uniqueMonths[uniqueMonths.length - 2]).padStart(2, '0') : String(uniqueMonths[0]).padStart(2, '0')));
            const toMonthData = data.filter(item => item.year === latestYear.toString() && item.month === String(latestMonth).padStart(2, '0'));
            setFilteredData(toMonthData);
            setIsLoading(false);
        }
    }, [data]);

    useEffect(() => {
        if (fromDate && toDate) {
            const [fromYear, fromMonth] = fromDate.split('-');
            const [toYear, toMonth] = toDate.split('-');

            const fromData = data.filter(item => item.year === fromYear && item.month === fromMonth);
            const toData = data.filter(item => item.year === toYear && item.month === toMonth);

            setFilteredData(toData);
        }
    }, [fromDate, toDate, data]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-full bg-grey shadow-lg rounded-lg p-4">
                <Loader />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="overflow-hidden w-full h-full bg-grey shadow-lg rounded-lg p-4">
                <h2>Enrollment Growth</h2>
                <p>No data available to display.</p>
            </div>
        );
    }

    const organizations = [...new Set(filteredData.map(item => item.parent_organization))];

    const chartData = {
        series: [{
            name: `Enrollment Change`,
            data: organizations.map(org => {
                const fromEnrollment = data.filter(item => item.year === fromDate.split('-')[0] && item.month === fromDate.split('-')[1] && item.parent_organization === org)
                    .reduce((acc, item) => acc + item.total_enrollment, 0);
                const toEnrollment = data.filter(item => item.year === toDate.split('-')[0] && item.month === toDate.split('-')[1] && item.parent_organization === org)
                    .reduce((acc, item) => acc + item.total_enrollment, 0);
                const change = toEnrollment - fromEnrollment;
                var percentage = fromEnrollment === 0 ? 0 : ((toEnrollment - fromEnrollment) / fromEnrollment) * 100;
                percentage = percentage.toFixed(2)
                return displayPercentage ? percentage : change;
            }),
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false,
                }
            },
            xaxis: {
                categories: organizations.map(org => org.split(' ')[0]),
                labels: {
                    style: {
                        colors: '#ffffff',
                        fontFamily: 'Karla, Helvetica, sans-serif',
                        fontSize: '12px',
                    },
                },
            },
            yaxis: {
                title: {
                    text: displayPercentage ? 'Percentage Change' : 'Change',
                    style: {
                        color: '#ffffff',
                        fontFamily: 'Karla, Helvetica, sans-serif',
                        fontSize: '16px'
                    }
                },
                labels: {
                    style: {
                        colors: '#ffffff',
                        fontFamily: 'Karla, Helvetica, sans-serif',
                        fontSize: '12px',
                    },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    endingShape: 'rounded',
                },
            },
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: '14px',
                    colors: ['#ffffff'], // Black labels
                    fontFamily: 'Karla, Helvetica, sans-serif'
                }
            },
            fill: {
                colors: ['#29e6c0']
            },
            tooltip: {
                y: {
                    formatter: (value) => displayPercentage ? `${value.toFixed(2)}%` : value,
                },
            },
        },
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fromDate') {
            setFromDate(value);
        } else if (name === 'toDate') {
            setToDate(value);
        }
    };

    const handleButtonClick = (isMost) => {
        setDisplayPercentage(isMost); // Switch between percentage and numbers
    };

    return (
        <div className="bg-dark-blue shadow-lg rounded-lg p-4">
             {/* Buttons moved to the next row */}
             <div className="flex items-center justify-end mb-4 ">
                <button
                    className={`px-6 py-2 rounded-l ${displayPercentage ? 'bg-aqua text-dark-blue' : 'bg-white text-dark-blue'}`}
                    onClick={() => handleButtonClick(true)}
                >
                    Percentage
                </button>
                <button
                    className={`px-6 py-2 rounded-r ${!displayPercentage ? 'bg-aqua text-dark-blue' : 'bg-white text-dark-blue'}`}
                    onClick={() => handleButtonClick(false)}
                >
                    Number
                </button>
            </div>
            <div className="mb-3 w-full">
                <div className="flex items-center space-x-4 font-karla">
                    <div className="flex items-center space-x-2 w-1/2">
                        <label htmlFor="fromDate" className="text-white font-karla whitespace-nowrap font-bold mr-2">From:</label>
                        <input
                            id="fromDate"
                            name="fromDate"
                            type="month"
                            value={fromDate}
                            onChange={handleDateChange}
                            className="w-full font-karla text-dark-blue bg-white border border-gray-300 rounded-lg p-1"
                        />
                    </div>
                    <div className="flex items-center space-x-2 w-1/2">
                        <label htmlFor="toDate" className="text-white font-karla whitespace-nowrap font-bold mr-2">To:</label>
                        <input
                            id="toDate"
                            name="toDate"
                            type="month"
                            value={toDate}
                            onChange={handleDateChange}
                            className="w-full font-karla text-dark-blue bg-white border border-gray-300 rounded-lg p-1"
                        />
                    </div>
                </div>
            </div>

           

            <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default EnrollmentGrowthChart;
