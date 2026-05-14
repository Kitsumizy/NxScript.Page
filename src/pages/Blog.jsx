function Blog() {
  const posts = [
    {
      slug: 'welcome-to-nxscript',
      title: 'Welcome to NxScript!',
      date: '2026-05-14',
      excerpt: 'NxScript is a new scripting language for Haxe. Here\'s what makes it special...',
      content: `
## Welcome to NxScript!

NxScript is a bytecode-compiled scripting language that runs inside Haxe. You write \`.nx\` files, 
the library compiles them to bytecode at runtime, and a stack-based VM executes them.

### Why NxScript?

1. **Hot Reload**: Change scripts without recompiling your entire project
2. **Fast**: Bytecode VM with optimized execution
3. **Familiar**: Syntax inspired by Haxe, JavaScript, and Python
4. **Flexible**: Full integration with Haxe objects and classes

### Getting Started

\`\`\`bash
haxelib git nxscript https://github.com/senioritaelizabeth/NxScript.git
\`\`\`

\`\`\`haxe
import nx.script.Interpreter;

var interp = new Interpreter();
interp.run('trace("Hello from NxScript!")');
\`\`\`

Stay tuned for more updates!
      `
    }
  ]

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Blog</h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {posts.map((post, i) => (
          <article key={i} style={{ 
            background: 'var(--bg-secondary)', 
            padding: '2rem', 
            borderRadius: '12px',
            border: '1px solid var(--border)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>{post.title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              {post.content.split('\n').filter(l => l.trim()).map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Blog
