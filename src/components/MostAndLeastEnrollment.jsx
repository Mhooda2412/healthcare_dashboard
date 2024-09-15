import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'; // Import arrow icons
import Loader from './Loader';
import { stateAbbreviationMap } from '../utils/stateAbbreviations';

const MostAndLeastEnrollment = ({ data }) => {
    const [chartData, setChartData] = useState(null);
    const [showTop, setShowTop] = useState(true); // Toggle state for top 3 or bottom 3 (reversed)

    const getStateDisplayName = (state) => {
        return Object.keys(stateAbbreviationMap).find(key => stateAbbreviationMap[key] === state) || state;
    };

    useEffect(() => {
        if (data && data.length > 0) {
            const validData = data.filter(item => item.state);
            const sortedData = [...validData].sort((a, b) => b.total_enrollment - a.total_enrollment);
            const filteredData = showTop ? sortedData.slice(0, 3) : sortedData.slice(-3);

            setChartData({
                labels: filteredData.map(item => getStateDisplayName(item.state)),
                series: [
                    {
                        name: 'Total Enrollment',
                        data: filteredData.map(item => item.total_enrollment)
                    }
                ]
            });
        }
    }, [data, showTop]);

    const handleButtonClick = (isTop) => {
        setShowTop(isTop);
    };

    if (!chartData) {
        return (
            <div className="flex justify-center items-center bg-grey shadow-lg rounded-lg p-4">
                <Loader />
            </div>
        );
    }

    const options = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                endingShape: 'rounded'
            }
        },
        xaxis: {
            categories: chartData.labels,
            title: {
                text: 'Total Enrollment',
                offsetY: 15,
                style: {
                    color: '#ffffff',
                    fontFamily: 'Karla, Helvetica, sans-serif',
                    fontSize: '16px'
                }
            },
            labels: {
                formatter: (value) => new Intl.NumberFormat().format(value),
                style: {
                    colors: '#ffffff',
                    fontFamily: 'Karla, Helvetica, sans-serif',
                    fontSize: '12px',
                },
            }
        },
        yaxis: {
            // title: {
            //     text: 'Total Enrollment',
            //     style: {
            //         color: '#ffffff',
            //         fontFamily: 'Karla, Helvetica, sans-serif',
            //         fontSize: '16px'
            //     }
            // },
            labels: {
                style: {
                    colors: '#ffffff',
                    fontFamily: 'Karla, Helvetica, sans-serif',
                    fontSize: '12px',
                },
            },
        },
        tooltip: {
            y: {
                formatter: (value) => new Intl.NumberFormat().format(value)
            },
            style: {
                fontFamily: 'Karla, Helvetica, sans-serif',
                fontSize: '16px'
            },
        },
        fill: {
            colors: ['#29e6c0']
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '14px',
                colors: ['#ffffff'], // Black labels
                fontFamily: 'Karla, Helvetica, sans-serif'
            }
        },
    };

    return (
        <div className=" bg-dark-blue shadow-lg rounded-lg p-4">
            <div className="mb-3 top-4 left-auto right-4 flex justify-end items-center font-karla">
                <button
                    className={`px-6 py-2 rounded-l ${showTop ? 'bg-aqua text-dark-blue' : 'bg-white text-dark-blue'}`}
                    onClick={() => handleButtonClick(true)}
                >
                    Most
                </button>
                <button
                    className={`px-6 py-2 rounded-r ${!showTop ? 'bg-aqua text-dark-blue' : 'bg-white text-dark-blue'}`}
                    onClick={() => handleButtonClick(false)}
                >
                    Least
                </button>
            </div>

            <ReactApexChart
                options={options}
                series={chartData.series}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default MostAndLeastEnrollment;
