import React from "react";
import { Link } from "react-router-dom";
import { Play, Info } from "lucide-react";
import "./Home.css";

export function Home() {
	return (
		<div className="home-container">
			<section className="home-hero">
				<h1 className="home-title">Wikipedia Race</h1>
				<p className="home-subtitle">
					Trouve le chemin le plus rapide entre deux articles Wikipédia !
				</p>

				<div className="home-actions">
					<Link to="/partie" className="home-btn primary">
						<Play size={18} />
						<span>Commencer une partie</span>
					</Link>
					<Link to="/stats" className="home-btn secondary">
						<Info size={18} />
						<span>Voir les statistiques</span>
					</Link>
				</div>
			</section>

			<section className="home-howto">
				<h2>Comment jouer ?</h2>
				<ol>
					<li>Un point de départ et un objectif sur Wikipédia sont choisis.</li>
					<li>Tu navigues en cliquant sur les liens internes d’article en article.</li>
					<li>Le but : atteindre la page cible le plus vite possible !</li>
				</ol>
			</section>
		</div>
	);
}
