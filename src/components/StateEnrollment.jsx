import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';
import { stateAbbreviationMap } from '../utils/stateAbbreviations';
import { stateIdToName } from '../utils/stateId';
import Loader from './Loader';

// Your existing color mapping function and legendColors

// Color mapping function
const getColor = (d) => {
  return d > 3000000 ? '#d4384d' :    // Very High
    d > 2000000 ? '#e86140' :    // High
      d > 1000000 ? '#fcb032' :    // Moderate-High
        d > 500000 ? '#f0dcca' :    // Moderate
          d > 250000 ? '#dfeaf2' :    // Low-Moderate
            d > 100000 ? '#88dff7' :    // Low
              d > 50000 ? '#14a6fa' :    // Very Low
                '#a7a1ff';    // Minimal
};

const legendColors = [
  { color: '#a7a1ff', label: '<50K' },
  { color: '#14a6fa', label: '>50K' },
  { color: '#88dff7', label: '>100K' },
  { color: '#dfeaf2', label: '>250K' },
  { color: '#f0dcca', label: '>500K' },
  { color: '#fcb032', label: '>1M' },
  { color: '#e86140', label: '>2M' },
  { color: '#d4384d', label: '>3M' },
];


const StateEnrollment = ({ enrollmentData, geoData }) => {
  // Your existing useState and useRef hooks
  const [loading, setLoading] = useState(true);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  
  useEffect(() => {
    if (Object.keys(enrollmentData).length === 0) return;
    const svg = d3.select(svgRef.current);
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    svg.attr('width', width).attr('height', height);

    const path = d3.geoPath();

    d3.json('https://d3js.org/us-10m.v1.json')
      .then((data) => {
        svg.selectAll('g').remove(); // Clear previous drawings

        svg
          .append('g')
          .attr('class', 'states')
          .selectAll('path')
          .data(feature(data, data.objects.states).features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('data-id', (d) => d.id)
          .attr('fill', (d) => {
            const stateId = d.id;
            const stateName = stateIdToName[stateId] || 'Unknown';
            const stateAbbreviation = stateAbbreviationMap[stateName];
            const enrollment =
              enrollmentData.find((item) => item.state === stateAbbreviation) || {};
            return getColor(enrollment.total_enrollment || 0);
          })
          .on('mouseover', function (event, d) {
            const [x, y] = d3.pointer(event);
            const stateId = d.id;
            const stateName = stateIdToName[stateId] || 'Unknown';
            const stateAbbreviation = stateAbbreviationMap[stateName];
            const enrollment =
              enrollmentData.find((item) => item.state === stateAbbreviation) || {};
            const stateGeoData = geoData.filter((item) => {
              return item.state === stateAbbreviation;
            });

            const lastMonthOfEachYear = stateGeoData.reduce((acc, current) => {
              const year = current.year;
              if (!acc[year] || acc[year].month < current.month) {
                acc[year] = current;
              }
              return acc;
            }, {});

            const sparklineData = Object.values(lastMonthOfEachYear).slice(-2);
            var growth = (((sparklineData[1].total_enrollment - sparklineData[0].total_enrollment)/(sparklineData[0].total_enrollment))*100)

            const tooltip = d3.select(tooltipRef.current)
              .style('visibility', 'visible');

            tooltip.html(`
              <div class="p-4 shadow-lg rounded-md tooltip">
                <h2 class="font-canela font-bold text-2xl text-dark-blue mb-2">${stateName}</h2>
                <p class="font-karla text-dark-blue"><span class="font-bold">Enrollment:</span> ${enrollment.total_enrollment?.toLocaleString() || 'N/A'}</p>
                <p class="font-karla text-dark-blue"><span class="font-bold">Popular Plan:</span> ${enrollment.plan_name || 'N/A'}</p>
                <p class="font-karla text-dark-blue"><span class="font-bold">Growth:</span> ${Math.round((growth + Number.EPSILON) * 100) / 100 } % </p>
              </div>
            `);

            // createRoot(document.getElementById('sparkline')).render(<SparklineChart data={sparklineData} />)

            // Adjust tooltip position
            // (your existing tooltip position adjustment logic)
            const svgBounds = svg.node().getBoundingClientRect();
            const tooltipElement = tooltip.node();
            const tooltipWidth = tooltipElement.offsetWidth;
            const tooltipHeight = tooltipElement.offsetHeight;

            // Initial tooltip position, 10px to the right and below the cursor
            let adjustedX = x + 10;
            let adjustedY = y + 10;

            // Check right edge
            if (adjustedX + tooltipWidth > svgBounds.width) {
              adjustedX = svgBounds.width - tooltipWidth - 10; // Adjust to stay inside right edge
            }

            // Check left edge
            if (adjustedX < 0) {
              adjustedX = 10; // Adjust to stay inside left edge
            }

            // Check bottom edge
            if (adjustedY + tooltipHeight > svgBounds.height) {
              adjustedY = svgBounds.height - tooltipHeight - 10; // Adjust to stay inside bottom edge
            }

            // Check top edge
            if (adjustedY < 0) {
              adjustedY = 10; // Adjust to stay inside top edge
            }

            // Apply the adjusted positions
            tooltip
              .style('top', `${adjustedY}px`)
              .style('left', `${adjustedX}px`)
              .style('background-color', 'rgba(255, 255, 255, 0.85)');

          })
          .on('mouseout', () => {
            d3.select(tooltipRef.current).style('visibility', 'hidden');
          });

        // Your existing state borders and legend drawing code
        const legend = svg.append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(${width + 100 } , ${height - (legendColors.length * 20) + 150 })`);

        legend.selectAll('rect')
          .data(legendColors)
          .enter()
          .append('rect')
          .attr('x', 0)
          .attr('y', (d, i) => i * 20)
          .attr('width', 18)
          .attr('height', 18)
          .style('fill', d => d.color);

        legend.selectAll('text')
          .data(legendColors)
          .enter()
          .append('text')
          .attr('x', 24)
          .attr('y', (d, i) => i * 20 + 9)
          .attr('dy', '.35em')
          .style('text-anchor', 'start')
          .style('font-size', '12px')
          .style('fill','#ffffff')
          .text(d => d.label);

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading or parsing GeoJSON data:', error);
        setLoading(false);
      });
  }, [enrollmentData, geoData]);

  return (
    <div className="bg-dark-blue w-full h-full shadow-lg rounded-lg p-4 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <Loader />
        </div>
      )}
      <svg ref={svgRef} className="w-full h-full" viewBox="0 0 960 600">
        <style>
          {`
            .states path:hover {
              fill: #29e6c0;
            }
            .state-borders {
              fill: none;
              stroke: #fff;
              stroke-width: 0.5px;
              stroke-linejoin: round;
              stroke-linecap: round;
              pointer-events: none;
            }
            .tooltip {
              max-width: 400px;
              max-width: 400px;
              border: 1px solid rgba(0, 0, 0, 0.5);
            }
          `}
        </style>
      </svg>
      <div
        ref={tooltipRef}
        className="absolute bg-white border border-dark-blue p-2 rounded text-xs"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          visibility: 'hidden',
        }}
      />
    </div>
  );
};

export default StateEnrollment;
