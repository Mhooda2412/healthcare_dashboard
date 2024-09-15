import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Chart from 'react-apexcharts';
import { stateAbbreviationMap } from '../utils/stateAbbreviations';

const EnrollmentTrendLine = ({ trendData, geoData }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [series, setSeries] = useState([{}]);
    const [selectedState, setSelectedState] = useState('All');

    const getStateDisplayName = (state) => {
        return Object.keys(stateAbbreviationMap).find(key => stateAbbreviationMap[key] === state) || state;
    };

    const [options] = useState({
        chart: {
            type: 'line',
            zoom: {
                enabled: false,
                type: 'x',
                autoScaleYaxis: true,
            },
            toolbar: {
                show: false,
            }
        },
        xaxis: {
            type: 'datetime',
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
                text: 'Total Enrollment',
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
        tooltip: {
            x: {
                format: 'yyyy-MM',
            },
            style: {
                fontFamily: 'Karla, Helvetica, sans-serif',
                fontSize: '16px'
            },
        },
        stroke: {
            curve: 'smooth',
            colors: ['#29e6c0'],
            width: 3 // Add this to make the stroke line thinner
        },
        markers: {
            size: 0,
        },
        toolbar: {
            show: false,
        }
    });
    

    useEffect(() => {
        if (trendData && trendData.length > 0) {
            const processedData = selectedState === 'All' ? trendData : geoData.filter(item => item.state === selectedState);
            const formattedData = processedData.map(item => {
                const date = new Date(item.year, item.month - 1).toISOString().slice(0, 10);
                return {
                    x: date,
                    y: item.total_enrollment,
                };
            });
            setSeries([{
                name: "Total Enrollment",
                data: formattedData,
            }]);
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [trendData, selectedState, geoData]); // Add selectedState to the dependency array

    return (
        <div className='trend-line'>
            {!isLoading ? (
                <div className="bg-dark-blue shadow-lg rounded-lg p-4">
                    <div className="mb-4 flex items-center">
                        <label htmlFor="stateSelect" className="text-white font-karla whitespace-nowrap font-bold mr-2">Select State:</label>
                        <select
                            id="stateSelect"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="block w-full font-karla text-dark-blue bg-white border border-gray-300 rounded-lg p-2"
                        >
                            <option value="All">All</option>
                            {geoData && Array.isArray(geoData) && geoData.length > 0 ? (
                                Array.from(new Set(geoData.map(item => item.state)))
                                    .sort()
                                    .map(state => (
                                        <option key={state} value={state}>
                                            {getStateDisplayName(state)}
                                        </option>
                                    ))
                            ) : (
                                <option disabled>No Data Available</option>
                            )}
                        </select>
                    </div>
                    <Chart options={options} series={series} type="line" height="350" />
                </div>
            ) : (
                <div className="flex justify-center items-center bg-grey shadow-lg rounded-lg p-4">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default EnrollmentTrendLine;
