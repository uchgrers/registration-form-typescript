import axios from "axios";

const baseURL = process.env.NODE_ENV === "production" ? "https://registration-form-typescript.vercel.app/" : "http://localhost:8000";

export const baseRequestParams = axios.create({
    withCredentials: true,
    baseURL
})