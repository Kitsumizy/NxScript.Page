import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

function ApiDoc() {
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/api.xml')
      .then(res => res.text())
      .then(xml => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, 'text/xml')
        
        const classes = []
        const classNodes = doc.querySelectorAll('class, abstract, enum')
        classNodes.forEach(cls => {
          const path = cls.getAttribute('path')
          if (!path || !path.startsWith('nx.')) return
          
          const type = cls.tagName
          const fields = []
          const methods = []
          
          // Get fields (only public)
          cls.querySelectorAll('field').forEach(field => {
            if (field.getAttribute('public') !== '1') return
            fields.push({
              name: field.getAttribute('name'),
              type: field.getAttribute('type') || field.querySelector('x')?.textContent || '',
              isStatic: field.getAttribute('static') === 'true',
              description: field.querySelector('haxe_doc')?.textContent || ''
            })
          })
          
          // Get methods (only public)
          cls.querySelectorAll('method').forEach(method => {
            if (method.getAttribute('public') !== '1') return
            const params = []
            method.querySelectorAll('param').forEach(p => {
              params.push({
                name: p.getAttribute('name'),
                type: p.getAttribute('type') || ''
              })
            })
            
            const returnsNode = method.querySelector('f')
            methods.push({
              name: method.getAttribute('name'),
              params: params,
              returns: method.getAttribute('returns') || '',
              isStatic: method.getAttribute('static') === 'true',
              description: method.querySelector('haxe_doc')?.textContent || ''
            })
          })
          
          const descNode = cls.querySelector('haxe_doc')
          classes.push({
            name: path.split('.').pop(),
            fullPath: path,
            type: type,
            description: descNode ? descNode.textContent : '',
            staticFields: fields.filter(f => f.isStatic),
            fields: fields.filter(f => !f.isStatic),
            staticMethods: methods.filter(m => m.isStatic),
            methods: methods.filter(m => !m.isStatic)
          })
        })

        classes.sort((a, b) => a.name.localeCompare(b.name))
        setApiData({ classes })
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading API:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="api-container">
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading API documentation...
        </div>
      </div>
    )
  }

  if (!apiData) {
    return (
      <div className="api-container">
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No API documentation available
        </div>
      </div>
    )
  }

  const filteredClasses = apiData.classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.fullPath.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selected = selectedClass ? apiData.classes.find(c => c.name === selectedClass) : null

  return (
    <div className="api-container" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
      {/* Sidebar */}
      <aside style={{ 
        background: 'var(--bg-secondary)', 
        borderRadius: '12px', 
        border: '1px solid var(--border)',
        padding: '1.5rem',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto'
      }}>
        <h3 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '1.1rem' }}>Classes</h3>
        
        <input
          type="text"
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            fontSize: '0.9rem'
          }}
        />
        
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filteredClasses.map((cls, i) => (
            <li key={i}>
              <button
                onClick={() => setSelectedClass(cls.name)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem 0.8rem',
                  marginBottom: '0.25rem',
                  background: selectedClass === cls.name ? 'var(--accent)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: selectedClass === cls.name ? '#000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedClass !== cls.name) {
                    e.target.style.background = 'var(--bg-tertiary)'
                    e.target.style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedClass !== cls.name) {
                    e.target.style.background = 'transparent'
                    e.target.style.color = 'var(--text-secondary)'
                  }
                }}
              >
                {cls.name}
                {cls.type === 'abstract' && <span style={{ fontSize: '0.75rem', opacity: 0.7 }}> (abstract)</span>}
                {cls.type === 'enum' && <span style={{ fontSize: '0.75rem', opacity: 0.7 }}> (enum)</span>}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <main>
        {selected ? (
          <div className="api-class-detail">
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ 
                background: 'var(--bg-tertiary)', 
                padding: '0.3rem 0.6rem', 
                borderRadius: '4px', 
                fontSize: '0.8rem',
                color: 'var(--accent)',
                marginRight: '0.5rem'
              }}>
                {selected.type.toUpperCase()}
              </span>
              <h1 style={{ display: 'inline', color: 'var(--text-primary)', fontSize: '2rem' }}>{selected.name}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                {selected.fullPath}
              </p>
            </div>
            
            {selected.description && (
              <div style={{ 
                background: 'var(--bg-secondary)', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                border: '1px solid var(--border)',
                marginBottom: '2rem'
              }}>
                <ReactMarkdown
                  components={{
                    p: ({children}) => <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', margin: 0 }}>{children}</p>
                  }}
                >
                  {selected.description}
                </ReactMarkdown>
              </div>
            )}

            {selected.staticMethods.length > 0 && (
              <Section title="Static Methods" items={selected.staticMethods} type="method" />
            )}
            
            {selected.staticFields.length > 0 && (
              <Section title="Static Variables" items={selected.staticFields} type="field" />
            )}
            
            {selected.methods.length > 0 && (
              <Section title="Methods" items={selected.methods} type="method" />
            )}
            
            {selected.fields.length > 0 && (
              <Section title="Variables" items={selected.fields} type="field" />
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Select a class</h2>
            <p>Choose a class from the sidebar to view its documentation</p>
          </div>
        )}
      </main>
    </div>
  )
}

function Section({ title, items, type = 'field' }) {
  const [expanded, setExpanded] = useState(true)
  
  return (
    <div style={{ marginBottom: '2rem' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '0.8rem 1rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--accent)',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}
      >
        <span>{title} ({items.length})</span>
        <span>{expanded ? '−' : '+'}</span>
      </button>
      
      {expanded && (
        <div style={{ paddingLeft: '0.5rem' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              background: 'var(--bg-tertiary)',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '0.5rem',
              borderLeft: '3px solid var(--accent)'
            }}>
              <code style={{ 
                color: 'var(--success)', 
                fontSize: '0.9rem', 
                display: 'block',
                marginBottom: '0.5rem',
                fontFamily: "'Fira Code', monospace"
              }}>
                {type === 'field' ? (
                  <>{item.name}<span style={{ color: 'var(--text-secondary)' }}>: {item.type}</span></>
                ) : (
                  <>{item.name}({item.params.map(p => `${p.name}${p.type ? ': ' + p.type : ''}`).join(', ')})
                  {item.returns && <span style={{ color: 'var(--text-secondary)' }}> → {item.returns}</span>}</>
                )}
              </code>
              {item.description && (
                <ReactMarkdown
                  components={{
                    p: ({children}) => (
                      <p style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '0.85rem', 
                        lineHeight: '1.6', 
                        margin: '0.5rem 0 0 0',
                        maxHeight: '4rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {children.length > 150 ? children.substring(0, 150) + '...' : children}
                      </p>
                    )
                  }}
                >
                  {item.description}
                </ReactMarkdown>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ApiDoc
