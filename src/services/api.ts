import axios from "axios"

// const BASE_URL = "http://127.0.0.1:3000";
const BASE_URL = "http://127.0.0.1:8000";
const BASE_URL_API = `${BASE_URL}/api`;

const instance = axios.create({
    baseURL: BASE_URL_API,
    /*
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
    */
});

// interceptores del cliente
instance.interceptors.request.use((config) =>{
    const token = localStorage.getItem("access_token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
});


// interceptores del Servidor
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem("access_token");
            location.href = "/auth/login"
        }
        return Promise.reject(error);
    }
)

export default instance;