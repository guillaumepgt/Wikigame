export const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
	randomPage: `${API_BASE_URL}/random-page`,
	pageByTitle: (title) => `${API_BASE_URL}/page/${encodeURIComponent(title)}`,
};