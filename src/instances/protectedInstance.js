import axios from "axios";

const baseURL = 'https://newsportalbackend-oatr.onrender.com/api/v1';

const protectedInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true // include cookies in requests
});

export default protectedInstance;