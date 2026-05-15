import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

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
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          margin: '1rem 0'
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props} style={{
                        background: 'var(--bg-tertiary)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontFamily: "'Fira Code', monospace",
                        fontSize: '0.9em',
                        color: 'var(--success)'
                      }}>
                        {children}
                      </code>
                    )
                  },
                  h2({children}) {
                    return (
                      <h2 style={{
                        color: 'var(--accent)',
                        fontSize: '1.5rem',
                        marginTop: '1.5rem',
                        marginBottom: '0.75rem'
                      }}>
                        {children}
                      </h2>
                    )
                  },
                  h3({children}) {
                    return (
                      <h3 style={{
                        color: 'var(--text-primary)',
                        fontSize: '1.2rem',
                        marginTop: '1.25rem',
                        marginBottom: '0.5rem'
                      }}>
                        {children}
                      </h3>
                    )
                  },
                  p({children}) {
                    return (
                      <p style={{
                        marginBottom: '0.75rem',
                        lineHeight: '1.6'
                      }}>
                        {children}
                      </p>
                    )
                  },
                  ol({children}) {
                    return (
                      <ol style={{
                        marginBottom: '1rem',
                        paddingLeft: '1.5rem'
                      }}>
                        {children}
                      </ol>
                    )
                  },
                  li({children}) {
                    return (
                      <li style={{
                        marginBottom: '0.4rem',
                        lineHeight: '1.5'
                      }}>
                        {children}
                      </li>
                    )
                  }
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Blog
