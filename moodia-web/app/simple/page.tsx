export default function SimplePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #7B5BFF 0%, #FF5E9C 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</h1>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>¡Moodia Funciona!</h2>
        <p style={{ fontSize: '1.5rem' }}>Next.js está corriendo correctamente</p>
      </div>
    </div>
  );
}