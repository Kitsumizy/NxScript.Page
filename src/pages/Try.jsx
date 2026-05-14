import TryEditor from '../components/TryEditor'

function Try() {
  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Try NxScript</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Write and run NxScript code directly in your browser. No installation required.
      </p>
      <TryEditor />
    </div>
  )
}

export default Try
