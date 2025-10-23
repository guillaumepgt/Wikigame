export async function fetchRandomWikipediaPage() {
	const url = `https://fr.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*`;
	const response = await fetch(url);
	const data = await response.json();
	return data.query.random[0].title;
}

export async function fetchWikipediaLinks(pageTitle) {
	setLoading(true);
	try {
		const url = `https://fr.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;
		const response = await fetch(url);
		console.log(response)
		const data = await response.json();

		if (data.parse) {
			const parser = new DOMParser();
			const doc = parser.parseFromString(data.parse.text['*'], 'text/html');

			// Supprimer les sections inutiles
			doc.querySelectorAll('.mw-editsection, .reference, script, style, noscript').forEach(el => el.remove());

			// Remplacer les liens par des boutons
			doc.querySelectorAll('a[href^="/wiki/"]').forEach(link => {
				const href = link.getAttribute('href');
				const title = href.replace('/wiki/', '').replace(/_/g, ' ');
				if (
					!title.includes(':') &&
					!title.startsWith('Fichier') &&
					!title.startsWith('File') &&
					link.textContent.trim().length > 0
				) {
					const button = doc.createElement('button');
					button.textContent = link.textContent;
					button.className = 'bg-blue-600/30 hover:bg-blue-600/50 text-white px-2 py-1 rounded transition-all m-0.5';
					button.onclick = () => clickLink(title);
					link.replaceWith(button);
				} else {
					// Supprimer les liens non valides
					link.replaceWith(link.textContent);
				}
			});

			setCurrentPage(pageTitle);
			setPageHistory(prev => [...prev, pageTitle]);
			setLinks([]); // désactiver le mode "liste de liens"
			setPageContent(doc.body.innerHTML);
		} else {
			alert('Page non trouvée');
		}
	} catch (error) {
		console.error('Erreur:', error);
		alert('Erreur lors du chargement de la page');
	}
	setLoading(false);
};