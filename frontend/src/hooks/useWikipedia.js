import { useState } from 'react';
import { wikipediaService } from '../services';

export function useWikipedia() {
	const [pageData, setPageData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchRandomPage = async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await wikipediaService.getRandomPage();
			setPageData(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erreur inconnue');
		} finally {
			setLoading(false);
		}
	};

	const fetchPageByTitle = async (title) => {
		if (!title.trim()) return;

		setLoading(true);
		setError(null);

		try {
			const data = await wikipediaService.getPageByTitle(title);
			setPageData(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erreur inconnue');
		} finally {
			setLoading(false);
		}
	};

	const clearError = () => setError(null);

	return {
		pageData,
		loading,
		error,
		fetchRandomPage,
		fetchPageByTitle,
		clearError,
	};
}