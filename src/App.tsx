import ArtTable from './components/ArtTable';

function App() {
  return (
    <main
    style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '1.5rem',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}
  >
    <ArtTable />
  </main>
  
  );
}

export default App;