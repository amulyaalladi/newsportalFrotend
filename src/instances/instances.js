import axios from "axios";

const baseURL = 'https://newsportalbackend-oatr.onrender.com/api/v1';

const Instance = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default Instance;