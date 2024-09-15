import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Chart from 'react-apexcharts';
import { stateAbbreviationMap } from '../utils/stateAbbreviations';

const BeneficiariesTrendLine = ({ trendData }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [series, setSeries] = useState([{}]);
    const [selectedField, setSelectedField] = useState('ORGNL_MDCR_BENES');

    const monthOrder = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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
            width: 3
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
            // Convert month names to numbers
            const monthToNumber = month => monthOrder.indexOf(month) + 1;

            const formattedData = trendData
                .filter(item => item.MONTH !== "Year") // Filter out yearly data
                .map(item => {
                    const month = monthToNumber(item.MONTH);
                    const date = new Date(`${item.YEAR}-${month.toString().padStart(2, '0')}-01`).toISOString().slice(0, 10);
                    return {
                        x: date,
                        y: parseInt(item[selectedField], 10), // Convert the value to integer
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
    }, [trendData, selectedField]);

    return (
        <div className='trend-line'>
            {!isLoading ? (
                <div className="bg-dark-blue shadow-lg rounded-lg p-4">
                    
                        <div className="mb-4 flex items-center">
                            <label htmlFor="stateSelect" className="text-white font-karla whitespace-nowrap font-bold mr-2">Select Beneficiary:</label>
                            <select
                                id="fieldSelect"
                                value={selectedField}
                                onChange={(e) => setSelectedField(e.target.value)}
                                className="block w-full font-karla text-dark-blue bg-white border border-gray-300 rounded-lg p-2"
                            >
                                <option value="ORGNL_MDCR_BENES">Original Medicare Beneficiaries</option>
                                <option value="PRSCRPTN_DRUG_TOT_BENES">Prescription Drug Beneficiaries</option>
                                <option value="A_B_TOT_BENES">A&B Total Beneficiaries</option>
                                <option value="DUAL_TOT_BENES">Dual Total Beneficiaries</option>
                            </select>
                        </div>
                   
                    {/* <div className="mb-4 flex items-center">
                        <label htmlFor="fieldSelect" className="text-gray-700 whitespace-nowrap font-bold mr-2">Select Field:</label>
                        <select
                            id="fieldSelect"
                            value={selectedField}
                            onChange={(e) => setSelectedField(e.target.value)}
                            className="block w-full bg-white border border-gray-300 rounded-lg p-2"
                        >
                            <option value="ORGNL_MDCR_BENES">Original Medicare Beneficiaries</option>
                            <option value="PRSCRPTN_DRUG_TOT_BENES">Prescription Drug Beneficiaries</option>
                            <option value="A_B_TOT_BENES">A&B Total Beneficiaries</option>
                            <option value="DUAL_TOT_BENES">Dual Total Beneficiaries</option>
                        </select>
                    </div> */}
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

export default BeneficiariesTrendLine;
