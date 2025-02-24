import React from 'react';
import axios from 'axios';

function Register() {
    return <h1>Wat wil je vandaag eten?</h1>;
}
export default Register;

async function fetchJoke() {
    try {
        const result = await axios.get('https://api.chucknorris.io/jokes/random');
        console.log(result);
    } catch (e) {
        console.error(e);
    }
}

fetchJoke();