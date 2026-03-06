import axios from "axios"

// const BASE_URL = "http://127.0.0.1:3000";
const BASE_URL = "http://127.0.0.1:8000";
const BASE_URL_API = `${BASE_URL}/api`;

const instance = axios.create({
    baseURL: BASE_URL_API,
});

// interceptores del cliente

// interceptores del Servidor

export default instance;