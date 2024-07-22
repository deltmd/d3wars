// src/components/NetworkGraph.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NetworkGraph = ({ films, planets }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (films.length === 0 || planets.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous renderings

        const width = 800;
        const height = 600;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        const nodes = [];
        const links = [];

        films.forEach(film => {
            nodes.push({ id: film.title, group: 'film' });
            film.planets.forEach(planetUrl => {
                const planetId = planetUrl.split('/')[5];
                const planet = planets.find(p => p.url.includes(planetId));
                if (planet) {
                    nodes.push({ id: planet.name, group: 'planet' });
                    links.push({ source: film.title, target: planet.name });
                }
            });
        });

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2));

        const link = svg.append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke-width', d => Math.sqrt(d.value));

        const node = svg.append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', 5)
            .attr('fill', d => d.group === 'film' ? 'blue' : 'green')
            .call(drag(simulation));

        node.append('title')
            .text(d => d.id);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        });

        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }

    }, [films, planets]);

    return (
        <div className="my-6">
            <h2 className="text-xl font-semibold mb-2">Network Graph of Star Wars Films and Key Planets</h2>
            <svg ref={svgRef} width={800} height={600}></svg>
        </div>
    );
};

export default NetworkGraph;