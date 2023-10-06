import { createContext } from 'react';

const APIEndpointsURL = createContext('http://127.0.0.1:8000/api/swagger.json');

export {APIEndpointsURL};