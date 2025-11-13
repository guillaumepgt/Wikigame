import React from "react";
import { useNavigate } from "react-router-dom";

import "./WikiHeader.css"

function Icon({ name, className = "" }) {
	switch (name) {
		case "home":
			return (
				<svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path d="M12 3l9 8h-3v8h-12v-8h-3l9-8z" />
				</svg>
			);
		case "game":
			return (
				<svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path d="M3 11v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6l-9-6-9 6z" />
				</svg>
			);
		case "stats":
			return (
				<svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path d="M4 21h2v-7h-2v7zm6 0h2v-13h-2v13zm6 0h2v-4h-2v4z" />
				</svg>
			);
		default:
			return null;
	}
}

export function WikiHeader({ active, brand = "WikiGame" }) {
	const navigate = useNavigate();

	const items = [
		{ id: "home", label: "Home", icon: "home", path: "/" },
		{ id: "partie", label: "Partie", icon: "game", path: "/page" },
		{ id: "stats", label: "Stats", icon: "stats", path: "/stats" },
	];

	const handleKeyDown = (e, idx) => {
		if (e.key === "ArrowRight") {
			const next = (idx + 1) % items.length;
			navigate(items[next].path);
			e.preventDefault();
		} else if (e.key === "ArrowLeft") {
			const prev = (idx - 1 + items.length) % items.length;
			navigate(items[prev].path);
			e.preventDefault();
		} else if (e.key === "Enter" || e.key === " ") {
			navigate(items[idx].path);
			e.preventDefault();
		}
	};

	return (
		<header className="site-header" role="banner">
			<div className="brand" aria-label={brand}>{brand}</div>

			<nav className="nav" role="navigation" aria-label="Navigation principale">
				<ul className="nav-list" role="tablist" aria-orientation="horizontal">
					{items.map((it, idx) => {
						const isActive = active === it.id;
						return (
							<li key={it.id} role="presentation">
								<button
									role="tab"
									aria-selected={isActive}
									tabIndex={isActive ? 0 : -1}
									className={`nav-item ${isActive ? "active" : ""}`}
									onClick={() => navigate(it.path)}
									onKeyDown={(e) => handleKeyDown(e, idx)}
								>
									<Icon name={it.icon} className="nav-icon" />
									<span className="nav-label">{it.label}</span>
								</button>
							</li>
						);
					})}
				</ul>
			</nav>

			<div className="header-actions">
				<button
					className="cta"
					onClick={() => navigate("/page")}
					aria-label="Démarrer une partie"
				>
					Nouvelle partie
				</button>
			</div>
		</header>
	);
}