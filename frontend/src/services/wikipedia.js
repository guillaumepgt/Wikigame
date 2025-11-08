import { API_ENDPOINTS } from '../config/api';

export const wikipediaService = {
	getRandomPage: async () => {
		const response = await fetch(API_ENDPOINTS.randomPage);

		if (!response.ok) {
			throw new Error(`Erreur HTTP: ${response.status}`);
		}

		return response.json();
	},

	getPageByTitle: async (title) => {
		const response = await fetch(API_ENDPOINTS.pageByTitle(title));

		if (!response.ok) {
			throw new Error(`Page non trouvée: ${title}`);
		}

		return response.json();
	},
};