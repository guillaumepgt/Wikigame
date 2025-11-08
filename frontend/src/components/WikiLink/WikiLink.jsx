export function WikiLink({ link }) {
	return (
		<div style={{ marginBottom: '20px' }}>
			<a
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				style={{
					color: '#0066cc',
					textDecoration: 'none',
					fontSize: '14px'
				}}
			>
				🔗 Voir sur Wikipedia →
			</a>
		</div>
	);
}