
import axios from "axios";
import AuthService from "./AuthService";


const getBaseUrl = () => "https://localhost:7107/api/";
const siteID = localStorage.getItem("siteID");
export const baseService = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "site-id": siteID,
    },
});

baseService.interceptors.request.use(
    async (config) => {
        const newConfig = config;

        const token = await AuthService.getLocalAccessToken();
        if (token) {
            newConfig.headers.Authorization = `Bearer ${token}`;
        }

        return newConfig;
    },
    (error) => Promise.reject(error),
);

export default baseService;