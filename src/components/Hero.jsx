import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="hero">
      <h1>NxScript</h1>
      <p>
        a scripting language for haxe that doesn't make you want to rewrite it yourself
      </p>
      <div className="hero-buttons">
        <Link to="/try" className="btn btn-primary">Try Online</Link>
        <Link to="/docs" className="btn btn-secondary">View Docs</Link>
        <a href="https://github.com/senioritaelizabeth/NxScript" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Bytecode VM</h3>
          <p>Compiles to bytecode and runs in a fast stack-based VM</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔄</div>
          <h3>Hot Reload</h3>
          <p>Change scripts without recompiling your Haxe project</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💚</div>
          <h3>Familiar Syntax</h3>
          <p>Mix of Haxe, JavaScript, and Python</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <h3>Full Integration</h3>
          <p>Seamless Haxe interoperability with native objects</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
