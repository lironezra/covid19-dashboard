import axios from 'axios';

const API_HOST = 'https://corona.lmao.ninja';

export const getCountriesData = async (sortBy) => {
    let response;

    try {
        response = await axios.get(`${API_HOST}/countries${sortBy ? `?sort=${sortBy}` : null}`);
        return response;    
    } catch (e) {
        console.log(`Failed to fetch countries: ${e.message}`, e)
    }    
}

export const getGlobalData = async () => {
    let response;

    try {
        response = await axios.get(`${API_HOST}/all`);
        return response;    
    } catch (e) {
        console.log(`Failed to fetch global data: ${e.message}`, e)
    }    
}