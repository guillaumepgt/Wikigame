export function Spinner() {
	return (
		<div style={{padding: '20px', textAlign: 'center'}}>
			<h2>Chargement...</h2>
			<div className="spinner">⏳</div>
			<style>{`
        .spinner {
          font-size: 48px;
          animation: spin 2s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
		</div>
	);
}