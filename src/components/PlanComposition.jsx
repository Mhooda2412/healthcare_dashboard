import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import Loader from './Loader';

const PlanComposition = ({ data }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrg, setSelectedOrg] = useState('All');
    const [selectedDate, setSelectedDate] = useState('');

    const orgOptions = [
        'All',
        'UnitedHealth Group, Inc.',
        'Humana Inc.',
        'CIGNA',
        'Kaiser Foundation Health Plan, Inc.',
        'CVS Health Corporation',
        'Elevance Health, Inc.',
        'Centene Corporation'
    ];

    useEffect(() => {
        if (data?.length > 0) {
            const uniqueYears = Array.from(new Set(data.map(plan => plan.year))).sort();
            const latestYear = uniqueYears[uniqueYears.length - 1];

            const uniqueMonths = Array.from(new Set(data
                .filter(plan => plan.year === latestYear)
                .map(plan => plan.month)
            )).sort((a, b) => new Date(0, a - 1) - new Date(0, b - 1));

            setSelectedDate(`${latestYear}-${String(uniqueMonths[uniqueMonths.length - 1]).padStart(2, '0')}`);
            setIsLoading(false);
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-full bg-white shadow-lg rounded-lg p-4">
                <Loader />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="overflow-hidden w-full h-full bg-white shadow-lg rounded-lg p-4">
                <h2>Total Enrollment by Plan Type</h2>
                <p>No data available to display.</p>
            </div>
        );
    }

    // Filter data based on selected organization and date
    const [selectedYear, selectedMonth] = selectedDate.split('-');
    const filteredPlans = data.filter(plan =>
        plan.month === selectedMonth &&
        plan.year === selectedYear &&
        (selectedOrg === 'All' || plan.parent_organization === selectedOrg)
    );

    // Combine the enrollments for all organizations when "All" is selected
    const aggregatedPlans = selectedOrg === 'All'
        ? filteredPlans.reduce((acc, curr) => {
              const existingPlan = acc.find(plan => plan.plan_type === curr.plan_type);
              if (existingPlan) {
                  existingPlan.total_enrollment += curr.total_enrollment;
              } else {
                  acc.push({ ...curr });
              }
              return acc;
          }, [])
        : filteredPlans;

    const totalEnrollment = aggregatedPlans.reduce((sum, plan) => sum + plan.total_enrollment, 0);

    const chartData = {
        series: aggregatedPlans.map(plan => plan.total_enrollment),
        labels: aggregatedPlans.map(plan => plan.plan_type),
    };

    const chartOptions = {
        chart: {
            type: 'donut',
        },
        labels: chartData.labels,
        colors: ["#2110bf","#15adaa","#e86140","#d4384d"], // Custom colors
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ],
        tooltip: {
            y: {
                formatter: (value) => new Intl.NumberFormat().format(value)
            },
            style: {
                fontFamily: 'Karla, Helvetica, sans-serif',
                fontSize: '16px'
            },
        },
        legend: {
            position: 'bottom',
            fontFamily: 'Karla, Helvetica, sans-serif',
            color: "ffffff",
            labels: {
                colors: ["#ffffff","#ffffff","#ffffff","#ffffff"],
                useSeriesColors: false
            }
        },
        plotOptions: {
            pie: {
                expandOnClick: true,
                donut: {
                    size: '65%', // Adjust the size of the donut hole
                },
            },
        },
    };

    const organizations = orgOptions;
    const years = Array.from(new Set(data.map(plan => plan.year))).sort();
    const months = Array.from(new Set(
        data.filter(plan => plan.year === selectedYear).map(plan => plan.month)
    )).sort((a, b) => new Date(0, a - 1) - new Date(0, b - 1));

    return (
        <div className="bg-dark-blue shadow-lg rounded-lg p-4">
            <div className="mb-4 flex flex-col space-y-4">
                {/* Selection Row */}
                <div className="flex flex-wrap gap-4">
                    {/* Organization Dropdown */}
                    <div className="flex-1 min-w-0">
                        <label className="text-white font-karla whitespace-nowrap font-bold mr-2">Organization:</label>
                        <select
                            onChange={e => setSelectedOrg(e.target.value)}
                            value={selectedOrg}
                            className="p-1.5 border rounded-md w-full font-karla text-dark-blue"
                        >
                            {organizations.map(org => (
                                <option key={org} value={org}>
                                    {org}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Date Picker */}
                    <div className="flex-1 min-w-0">
                        <label className="text-white font-karla whitespace-nowrap font-bold mr-2">Month and Year:</label>
                        <input
                            type="month"
                            onChange={e => setSelectedDate(e.target.value)}
                            value={selectedDate}
                            className="p-1 border rounded-md w-full font-karla text-dark-blue"
                        />
                    </div>
                </div>
            </div>
            
            <ApexCharts
                options={chartOptions}
                series={chartData.series}
                type="donut"
                height={423}
            />
        </div>
    );
};

export default PlanComposition;
