export async function LoadWikipediaPage(title = "France") {
	try {
		const htmlRes = await fetch(
			`https://fr.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`
		);

		const cssRes = await fetch(
			"https://fr.wikipedia.org/w/load.php?lang=fr&modules=site.styles&only=styles"
		);

		const html = await htmlRes.text();
		const css = await cssRes.text();

		if (!document.getElementById("wiki-css")) {
			const style = document.createElement("style");
			style.id = "wiki-css";
			style.textContent = css;
			document.head.appendChild(style);
		}

		const wikiDiv = document.getElementById("wiki");
		if (wikiDiv) {
			wikiDiv.innerHTML = html;

			const firstHeading = wikiDiv.querySelector('h1')?.textContent || title;

			wikiDiv.querySelectorAll('a[rel="mw:WikiLink"]').forEach(link => {
				link.addEventListener('click', (e) => {
					e.preventDefault();
					const title = link.getAttribute('title');
					if (title) {
						LoadWikipediaPage(title);
						const event = new CustomEvent("wiki:navigate", { detail: title });
						window.dispatchEvent(event);
					}
				});
			}, { once: true });
			return firstHeading;
		}
	} catch (err) {
		console.error("Erreur lors du chargement de la page Wikipédia :", err);
	}
}