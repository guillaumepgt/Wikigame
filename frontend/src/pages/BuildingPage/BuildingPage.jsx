import React from "react";
import "./BuildingPage.css";

export default function BuildingPage({ message = "Chargement en cours..." }) {
	return (
		<div className="building-container">
			<div className="building-content">
				<h1>🚧 Site en construction</h1>
				<p>{message}</p>
				<div className="loader"></div>
				<a href="/" className="home-link">Retour à l’accueil</a>
			</div>
		</div>
	);
}
