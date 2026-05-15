import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

function ApiDoc() {
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  function cleanDescription(text) {
    if (!text) return ''
    return text
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, ''))
      .join('\n')
      .trim()
  }

  function parseDocAnnotations(text) {
    if (!text) return { description: '', annotations: {} }
    
    const cleaned = cleanDescription(text)
    const lines = cleaned.split('\n')
    const descriptionLines = []
    const annotations = { params: [], returns: null, examples: [] }
    
    let currentSection = 'description'
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      if (trimmed.startsWith('@param')) {
        currentSection = 'param'
        const match = trimmed.match(/@param\s+(\w+)\s*(.*)/)
        if (match) {
          annotations.params.push({ name: match[1], description: match[2] })
        }
        continue
      }
      
      if (trimmed.startsWith('@return')) {
        currentSection = 'returns'
        annotations.returns = trimmed.replace(/@return\s*/, '')
        continue
      }
      
      if (trimmed.startsWith('@example')) {
        currentSection = 'example'
        continue
      }
      
      if (trimmed.startsWith('@')) {
        currentSection = 'other'
        continue
      }
      
      if (currentSection === 'description') {
        descriptionLines.push(line)
      }
    }
    
    return {
      description: descriptionLines.join('\n').trim(),
      annotations
    }
  }

  function getTypeName(node) {
    if (!node) return ''
    if (node.tagName === 'x' && node.getAttribute('path')) {
      return node.getAttribute('path')
    }
    if (node.tagName === 'c' || node.tagName === 't' || node.tagName === 'e') {
      return node.getAttribute('path') || ''
    }
    if (node.tagName === 'd') {
      return 'Dynamic'
    }
    return node.textContent || ''
  }

  function parseFunction(fNode, attr) {
    if (!fNode) return { params: [], returns: '' }
    
    const children = Array.from(fNode.children)
    if (children.length === 0) return { params: [], returns: '' }
    
    // Last child is return type, rest are param types
    const returnType = getTypeName(children[children.length - 1])
    
    const paramNamesRaw = attr || ''
    const paramNames = paramNamesRaw.split(':').filter(n => n.length > 0)
    
    const params = []
    for (let i = 0; i < paramNames.length; i++) {
      const name = paramNames[i].replace(/^\?/, '')
      const isOptional = paramNames[i].startsWith('?')
      // Param types are all children except the last one (return type)
      const paramTypeNode = i < children.length - 1 ? children[i] : null
      const paramType = paramTypeNode ? getTypeName(paramTypeNode) : ''
      
      params.push({
        name: name,
        type: paramType || 'Dynamic',
        optional: isOptional
      })
    }
    
    return { params, returns: returnType }
  }

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
          const staticMethods = []
          const methods = []
          const staticFields = []
          const fields = []
          
          const descNode = cls.querySelector(':scope > haxe_doc')
          const classDescription = descNode ? cleanDescription(descNode.textContent) : ''
          
          Array.from(cls.children).forEach(child => {
            const tagName = child.tagName
            if (tagName === 'haxe_doc' || tagName === 'meta' || tagName === 'impl') return
            
            if (child.getAttribute('public') !== '1') return
            
            const isStatic = child.getAttribute('static') === '1'
            const isMethod = child.getAttribute('set') === 'method' || tagName === 'new'
            const name = child.getAttribute('name') || tagName
            
            const fieldDoc = child.querySelector('haxe_doc')
            const rawDescription = fieldDoc ? fieldDoc.textContent : ''
            const { description, annotations } = parseDocAnnotations(rawDescription)
            
            if (isMethod) {
              const fNode = child.querySelector('f')
              const attr = fNode ? fNode.getAttribute('a') : ''
              const { params, returns } = parseFunction(fNode, attr)
              
              const methodData = {
                name: name,
                params: params,
                returns: annotations.returns || returns || '',
                description: description,
                annotations
              }
              
              if (isStatic) {
                staticMethods.push(methodData)
              } else {
                methods.push(methodData)
              }
            } else {
              let typeNode = child.firstElementChild
              let type = ''
              
              if (typeNode && typeNode.tagName !== 'haxe_doc' && typeNode.tagName !== 'meta') {
                type = getTypeName(typeNode)
              }
              
              const fieldData = {
                name: name,
                type: type || 'Dynamic',
                isStatic: isStatic,
                description: description,
                annotations
              }
              
              if (isStatic) {
                staticFields.push(fieldData)
              } else {
                fields.push(fieldData)
              }
            }
          })
          
          classes.push({
            name: path.split('.').pop(),
            fullPath: path,
            type: type,
            description: classDescription,
            staticFields,
            fields,
            staticMethods,
            methods
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

      <main>
        {selected ? (
          <div className="api-class-detail">
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ 
                background: 'var(--bg-tertiary)', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '0.75rem',
                color: 'var(--accent)',
                marginRight: '0.5rem',
                fontWeight: '600'
              }}>
                {selected.type.toUpperCase()}
              </span>
              <h1 style={{ display: 'inline', color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: '700' }}>{selected.name}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                {selected.fullPath}
              </p>
            </div>
            
            {selected.description && (
              <div style={{ 
                background: 'var(--bg-secondary)', 
                padding: '1.25rem', 
                borderRadius: '8px', 
                border: '1px solid var(--border)',
                marginBottom: '2rem'
              }}>
                <ReactMarkdown
                  components={{
                    p: ({children}) => <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0, fontSize: '0.95rem' }}>{children}</p>,
                    code: ({children}) => (
                      <code style={{ 
                        background: 'var(--bg-tertiary)', 
                        padding: '0.125rem 0.375rem', 
                        borderRadius: '3px',
                        fontSize: '0.85em',
                        color: 'var(--success)'
                      }}>{children}</code>
                    ),
                    pre: ({children}) => (
                      <pre style={{ 
                        background: 'var(--bg-tertiary)', 
                        padding: '1rem', 
                        borderRadius: '6px',
                        overflowX: 'auto',
                        margin: '0.75rem 0',
                        fontSize: '0.85em',
                        border: '1px solid var(--border)'
                      }}>{children}</pre>
                    )
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
    <div style={{ marginBottom: '1.5rem' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '0.6rem 0.875rem',
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid var(--border)',
          color: 'var(--text-primary)',
          fontSize: '0.85rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        <span>{title}</span>
        <span style={{ color: 'var(--text-secondary)' }}>{expanded ? '−' : '+'}</span>
      </button>
      
      {expanded && (
        <div style={{ paddingTop: '0.75rem' }}>
          {items.map((item, i) => (
            <MemberItem key={i} item={item} type={type} />
          ))}
        </div>
      )}
    </div>
  )
}

function MemberItem({ item, type }) {
  const [expanded, setExpanded] = useState(true)
  const hasDetails = item.description || (item.annotations?.params?.length > 0) || item.annotations?.returns
  
  return (
    <div style={{
      marginBottom: '0.75rem'
    }}>
      <div 
        onClick={() => hasDetails && setExpanded(!expanded)}
        style={{
          background: 'var(--bg-secondary)',
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          border: '1px solid var(--border)',
          cursor: hasDetails ? 'pointer' : 'default',
          transition: 'border-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <code style={{ 
          color: 'var(--success)', 
          fontSize: '0.85rem',
          fontFamily: "'Fira Code', monospace"
        }}>
          {type === 'field' ? (
            <>
              <span style={{ fontWeight: '600' }}>{item.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>: {item.type}</span>
            </>
          ) : (
            <>
              <span style={{ fontWeight: '600' }}>{item.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>(</span>
              {item.params.map((p, j) => (
                <span key={j}>
                  {j > 0 && <span style={{ color: 'var(--text-secondary)' }}>, </span>}
                  {p.optional && <span style={{ color: 'var(--text-secondary)' }}>[</span>}
                  <span>{p.name}</span>
                  {p.type && <span style={{ color: 'var(--text-secondary)' }}>: {p.type}</span>}
                  {p.optional && <span style={{ color: 'var(--text-secondary)' }}>]</span>}
                </span>
              ))}
              <span style={{ color: 'var(--text-secondary)' }}>)</span>
              {item.returns && (
                <>
                  <span style={{ color: 'var(--text-secondary)' }}> → </span>
                  <span style={{ color: 'var(--accent)' }}>{item.returns}</span>
                </>
              )}
            </>
          )}
        </code>
        
        {hasDetails && (
          <span style={{ 
            float: 'right', 
            color: 'var(--text-secondary)', 
            fontSize: '0.75rem',
            opacity: 0.5
          }}>
            {expanded ? '−' : '+'}
          </span>
        )}
      </div>
      
      {expanded && hasDetails && (
        <div style={{
          padding: '0.75rem 1rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          background: 'var(--bg-secondary)',
          borderRadius: '0 0 6px 6px',
          marginTop: '-1px',
          borderTop: '1px solid var(--border)'
        }}>
          {item.description && (
            <div style={{ marginBottom: item.annotations?.params?.length > 0 || item.annotations?.returns ? '0.75rem' : '0' }}>
              <ReactMarkdown
                components={{
                  p: ({children}) => <p style={{ margin: 0 }}>{children}</p>,
                  code: ({children}) => (
                    <code style={{ 
                      background: 'var(--bg-tertiary)', 
                      padding: '0.125rem 0.375rem', 
                      borderRadius: '3px',
                      fontSize: '0.85em',
                      color: 'var(--success)'
                    }}>{children}</code>
                  ),
                  pre: ({children}) => (
                    <pre style={{ 
                      background: 'var(--bg-tertiary)', 
                      padding: '1rem', 
                      borderRadius: '6px',
                      overflowX: 'auto',
                      margin: '0.75rem 0',
                      fontSize: '0.85em',
                      border: '1px solid var(--border)'
                    }}>{children}</pre>
                  )
                }}
              >
                {item.description}
              </ReactMarkdown>
            </div>
          )}
          
          {item.annotations?.returns && (
            <div style={{ 
              marginBottom: item.annotations?.params?.length > 0 ? '0.5rem' : '0',
              paddingLeft: '0.75rem',
              borderLeft: '2px solid var(--accent)'
            }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.8rem' }}>Returns: </strong>
              <span>{item.annotations.returns}</span>
            </div>
          )}
          
          {item.annotations?.params?.length > 0 && (
            <div style={{ paddingLeft: '0.75rem', borderLeft: '2px solid var(--border)' }}>
              {item.annotations.params.map((param, j) => (
                <div key={j} style={{ marginBottom: j < item.annotations.params.length - 1 ? '0.375rem' : '0' }}>
                  <code style={{ 
                    color: 'var(--success)',
                    fontSize: '0.8em',
                    background: 'var(--bg-tertiary)',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '3px'
                  }}>{param.name}</code>
                  {param.description && (
                    <span style={{ marginLeft: '0.375rem' }}>{param.description}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ApiDoc
