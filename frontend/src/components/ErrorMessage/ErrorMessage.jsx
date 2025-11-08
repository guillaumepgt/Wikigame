export function ErrorMessage({ message, onRetry }) {
	return (
		<div style={{ padding: '20px', color: 'red' }}>
			<h2>❌ Erreur</h2>
			<p>{message}</p>
			<button
				onClick={onRetry}
				style={{
					padding: '10px 20px',
					backgroundColor: '#dc3545',
					color: 'white',
					border: 'none',
					borderRadius: '5px',
					cursor: 'pointer'
				}}
			>
				Réessayer
			</button>
		</div>
	);
}