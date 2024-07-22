import axios from 'axios';

const BASE_URL = 'https://swapi.dev/api/';

export const fetchFilms = async () => {
    const response = await axios.get(`${BASE_URL}films/`);
    console.log(response.data.results);
    return response.data.results;
};

export const fetchPlanets = async () => {
    const response = await axios.get(`${BASE_URL}planets/`);
    console.log(response.data.results);
    return response.data.results;
};

export const fetchPeople = async () => {
    const response = await axios.get(`${BASE_URL}people/`);
    return response.data.results;
};