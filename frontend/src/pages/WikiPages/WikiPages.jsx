import {useEffect, useState} from 'react';
import { useWikipedia } from '../../hooks';
import {
	Spinner,
	ErrorMessage,
	WikiName,
	LoadWikipediaPage
} from '../../components';

export function WikiPages() {
	const {
		pageData,
		loading,
		error,
		fetchRandomPage
	} = useWikipedia();

	const [currentTitle, setCurrentTitle] = useState(null);

	useEffect(() => {
		fetchRandomPage();
	}, []);

	useEffect(() => {
		if (pageData?.title) {
			LoadWikipediaPage(pageData.title).then(setCurrentTitle);
		}
	}, [pageData]);

	useEffect(() => {
		const handleNavigate = (e) => {
			setCurrentTitle(e.detail);
		};
		window.addEventListener("wiki:navigate", handleNavigate);
		return () => window.removeEventListener("wiki:navigate", handleNavigate);
	}, []);

	if (loading) return <Spinner />;
	if (error) return <ErrorMessage message={error} onRetry={fetchRandomPage} />;
	if (!pageData) return null;

	return (
		<div style={{ margin: '50px', padding: '20px' }}>
			<WikiName
				title={currentTitle || pageData.title}
				link={pageData.link}
				onRandomPage={fetchRandomPage}
			/>
			<div id="wiki"/>
		</div>
	);
}