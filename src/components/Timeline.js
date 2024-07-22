// src/components/Timeline.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Timeline = ({ films }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (films.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous renderings

        const width = 800;
        const height = 200;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        const x = d3
            .scaleTime()
            .domain(d3.extent(films, d => new Date(d.release_date)))
            .range([margin.left, width - margin.right]);

        const y = d3
            .scaleBand()
            .domain(films.map(d => d.title))
            .range([height - margin.bottom, margin.top]);

        const xAxis = g =>
            g
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        const yAxis = g =>
            g.attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

        svg.append('g').call(xAxis);
        svg.append('g').call(yAxis);

        svg
            .append('g')
            .attr('stroke', 'black')
            .attr('stroke-width', 1.5)
            .attr('fill', 'none')
            .selectAll('circle')
            .data(films)
            .join('circle')
            .attr('cx', d => x(new Date(d.release_date)))
            .attr('cy', d => y(d.title) + y.bandwidth() / 2)
            .attr('r', 5);

    }, [films]);

    return (
        <div className="my-6">
            <h2 className="text-xl font-semibold mb-2">Timeline of Star Wars Films</h2>
            <svg ref={svgRef} width={800} height={200}></svg>
        </div>
    );
};

export default Timeline;