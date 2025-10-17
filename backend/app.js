// backend/app.js
import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/wiki/:title", async (req, res) => {
	const title = req.params.title;
	const url = `https://fr.wikipedia.org/wiki/${encodeURIComponent(title)}`;

	try {
		const response = await fetch(url);
		let html = await response.text();

		// Supprime les liens externes et ajoute un "intercepteur" pour rester sur le site
		html = html.replace(
			/href="\/wiki\/([^"#]+)"/g,
			'href="#" onclick="parent.postMessage({type:\'wikiClick\', page:\'$1\'}, \'*\')"'
		);

		res.send(html);
	} catch (err) {
		res.status(500).send("Erreur de chargement de la page Wikipédia");
	}
});

app.listen(3001, () => console.log("Backend running on port 3001"));
