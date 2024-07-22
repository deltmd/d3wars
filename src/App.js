// src/App.js
import React, { useEffect, useState } from 'react';
import { fetchFilms, fetchPlanets } from './api';
// import Timeline from './components/Timeline';
// import NetworkGraph from './components/NetworkGraph';
import SankeyDiagram from './components/SankeyDiagram';

const App = () => {
    const [films, setFilms] = useState([]);
    const [planets, setPlanets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const filmsData = await fetchFilms();
            const planetsData = await fetchPlanets();
            setFilms(filmsData);
            setPlanets(planetsData);
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen p-6 bg-sw-blue-light">
            <h1 className="text-2xl font-bold mb-4 text-sw-brown-dark">Time and Space Navigator: A Star Wars Journey</h1>
            <p className="mb-4 text-sw-brown-dark">
                While reimagining digital advertising, we stumbled on a new technology that can transport us in
                time and space. We would like to transport ourselves a long time ago to a galaxy far, far away in
                order to participate in the events of the Star Wars films. We need to decide the location that
                would place us most central to the storyline at the earliest possible moment. Using the data from
                the Star Wars API (https://swapi.dev/), create a visualization (or visualizations) that would help
                us select the relevant planet and moment (film) in the story.
            </p>
            {/* <Timeline films={films} />
            <NetworkGraph films={films} planets={planets} /> */}
            <SankeyDiagram />
        </div>
    );
};

export default App;