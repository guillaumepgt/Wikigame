export function WikiName({ title, link, onRandomPage }) {
	return (
		<div style={{
			marginBottom: '20px',
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center'
		}}>
			<h1 style={{ margin: 0 }}>{title}</h1>
			<button
				onClick={onRandomPage}
				style={{
					padding: '10px 20px',
					backgroundColor: '#0066cc',
					color: 'white',
					border: 'none',
					borderRadius: '5px',
					cursor: 'pointer',
					fontSize: '16px',
					transition: 'background-color 0.2s'
				}}
				onMouseOver={(e) => e.target.style.backgroundColor = '#0052a3'}
				onMouseOut={(e) => e.target.style.backgroundColor = '#0066cc'}
			>
				🎲 Page aléatoire
			</button>
		</div>
	);
}