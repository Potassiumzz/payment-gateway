import axios from "axios";

const defaultHeaders = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const api = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	timeout: 5000,
	headers: defaultHeaders,
});
