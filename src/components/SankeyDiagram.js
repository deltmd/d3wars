// src/components/SankeyDiagram.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { fetchPeople, fetchFilms, fetchPlanets } from '../api';
import Modal from './Modal';
import LoadingAnimation from './LoadingAnimation';

const SankeyDiagram = () => {
    const svgRef = useRef();
    const containerRef = useRef();
    const headingRef = useRef();
    const [data, setData] = useState({ nodes: [], links: [] });
    const [details, setDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const people = await fetchPeople();
                const films = (await fetchFilms()).sort((a, b) => a.episode_id - b.episode_id);
                const planets = await fetchPlanets();

                const planetNodes = planets
                    .map(planet => ({ id: planet.name, type: 'planet' }))
                    .filter(node => people.some(person => person.homeworld && planets.find(p => p.url === person.homeworld)?.name === node.id));

                const filmNodes = films.map(film => ({ id: film.title, type: 'film' }));

                const links = [];
                people.forEach(person => {
                    person.films.forEach(filmUrl => {
                        const film = films.find(f => f.url === filmUrl);
                        if (film && person.homeworld) {
                            const planet = planets.find(p => p.url === person.homeworld);
                            if (planet) {
                                links.push({ source: planet.name, target: film.title, value: 1, person: person.name });
                            }
                        }
                    });
                });

                setData({ nodes: [...planetNodes, ...filmNodes], links });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.nodes.length === 0) return;

        const containerWidth = containerRef.current.offsetWidth;
        const width = containerWidth > 1000 ? 1000 : containerWidth;
        const height = width * 0.6; // Maintain aspect ratio

        const headingHeight = headingRef.current.offsetHeight; // Get the height of the h2 element

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous renderings

        const { nodes, links } = sankey()
            .nodeId(d => d.id)
            .nodeWidth(15)
            .nodePadding(10)
            .size([width, height])
            ({ nodes: data.nodes.map(d => Object.assign({}, d)), links: data.links.map(d => Object.assign({}, d)) });

        const transition = svg.transition().duration(750);

        svg.append('g')
            .selectAll('rect')
            .data(nodes)
            .join('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => d.y1 - d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('fill', d => d.type === 'planet' ? '#1f77b4' : '#ff7f0e')
            .style('cursor', 'pointer') // Change cursor to pointer
            .call(enter => enter.transition(transition)
                .attr('x', d => d.x0)
                .attr('y', d => d.y0)
                .attr('height', d => d.y1 - d.y0)
                .attr('width', d => d.x1 - d.x0))
            .on('click', (event, d) => {
                const connectedLinks = links.filter(link => link.source.id === d.id || link.target.id === d.id);
                setDetails({
                    node: d.id,
                    connections: connectedLinks.map(link => ({
                        film: link.target.id,
                        person: link.person
                    }))
                });
                setShowModal(true);
            })
            .append('title')
            .text(d => d.id);

        svg.append('g')
            .attr('fill', 'none')
            .attr('stroke-opacity', 0.5)
            .selectAll('path')
            .data(links)
            .join('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', '#000')
            .attr('stroke-width', d => Math.max(1, d.width))
            .call(enter => enter.transition(transition).attr('d', sankeyLinkHorizontal()))
            .append('title')
            .text(d => `${d.source.id} → ${d.target.id}: ${d.person}`);

        svg.append('g')
            .style('font', '10px sans-serif')
            .selectAll('text')
            .data(nodes)
            .join('text')
            .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
            .call(enter => enter.transition(transition)
                .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
                .attr('y', d => (d.y1 + d.y0) / 2))
            .text(d => d.id);

        // Adjust container height to fit the SVG
        const svgHeight = svg.node().getBBox().height;

        // Update viewBox to make SVG responsive
        svg.attr('viewBox', `0 0 ${width} ${height}`);
    }, [data]);

    return (
        <div ref={containerRef} className="p-6 bg-sw-brown-light border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700">
            <h2 ref={headingRef} className="text-xl font-semibold mb-2 text-sw-brown-dark">Star Wars Planets and Films Sankey Diagram</h2>
            <div className="w-full overflow-x-auto">
                {loading ? (
                    <LoadingAnimation />
                ) : (
                    <svg ref={svgRef} className="w-full h-auto" preserveAspectRatio="xMidYMid meet"></svg>
                )}
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                {details && (
                    <div>
                        <h3 className="text-lg font-bold">{details.node}</h3>
                        <ul>
                            {details.connections.map((connection, index) => (
                                <li key={index}>
                                    <strong>{connection.film}</strong>: {connection.person}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SankeyDiagram;