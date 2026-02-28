import { useState, useEffect } from 'react'

function App() {
  const [status, setStatus] = useState('Checking backend status...')

  useEffect(() => {
    // Because of our Vite proxy, this actually hits http://localhost:8080/api/status
    fetch('/api/status')
      .then(res => res.text())
      .then(data => setStatus(data))
      .catch(err => setStatus('Failed to connect to backend. Is Spring Boot running?'));
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white font-sans">
      <div className="p-10 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-blue-500">
          Pharos
        </h1>
        <p className="text-lg text-slate-300 font-medium">
          {status}
        </p>
      </div>
    </div>
  )
}

export default App