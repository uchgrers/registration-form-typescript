import axios from "axios";

const baseURL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000";

export const baseRequestParams = axios.create({
    withCredentials: true,
    baseURL
})