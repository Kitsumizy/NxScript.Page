import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-logo">NxScript</Link>
      <nav className="header-nav">
        <Link to="/docs">Docs</Link>
        <Link to="/api">API</Link>
        <Link to="/try">Try</Link>
        <Link to="/examples">Examples</Link>
        <Link to="/blog">Blog</Link>
        <a href="https://github.com/senioritaelizabeth/NxScript" target="_blank" rel="noopener noreferrer">GitHub</a>
      </nav>
    </header>
  )
}

export default Header
