import { useState, useEffect } from 'react'

function ApiDoc() {
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedClass, setExpandedClass] = useState(null)

  useEffect(() => {
    fetch('/api.xml')
      .then(res => res.text())
      .then(xml => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, 'text/xml')
        
        const classes = []
        const classNodes = doc.querySelectorAll('class')
        classNodes.forEach(cls => {
          const path = cls.getAttribute('path')
          if (!path) return
          
          const methods = []
          const methodNodes = cls.querySelectorAll('method')
          methodNodes.forEach(method => {
            const name = method.getAttribute('name')
            if (!name) return
            
            const params = []
            method.querySelectorAll('param').forEach(p => {
              params.push({
                name: p.getAttribute('name'),
                type: p.getAttribute('type')
              })
            })
            
            const returnsNode = method.querySelector('x, f, c, i')
            let returns = method.getAttribute('returns')
            if (!returns && returnsNode) {
              returns = returnsNode.textContent || returnsNode.getAttribute('path') || ''
            }
            
            const descNode = method.querySelector('haxe_doc')
            methods.push({
              name: name,
              params: params,
              returns: returns || '',
              description: descNode ? descNode.textContent : ''
            })
          })

          const descNode = cls.querySelector('haxe_doc')
          classes.push({
            name: path.split('.').pop(),
            fullPath: path,
            description: descNode ? descNode.textContent : '',
            methods
          })
        })

        setApiData({ classes })
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading API:', err)
        setLoading(false)
      })
  }, [])

  const toggleClass = (index) => {
    setExpandedClass(expandedClass === index ? null : index)
  }

  if (loading) {
    return (
      <div className="api-container">
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading API documentation...
        </div>
      </div>
    )
  }

  if (!apiData || apiData.classes.length === 0) {
    return (
      <div className="api-container">
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No API documentation available
        </div>
      </div>
    )
  }

  return (
    <div className="api-container">
      <h1 style={{ marginBottom: '2rem', color: 'var(--accent)' }}>API Reference</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        {apiData.classes.length} classes documented
      </p>
      
      {apiData.classes.map((cls, i) => (
        <div key={i} className="api-class" style={{ 
          marginBottom: '0.5rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.5rem'
        }}>
          <button 
            onClick={() => toggleClass(i)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              color: 'var(--accent)',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
            onMouseLeave={(e) => e.target.style.background = 'var(--bg-tertiary)'}
          >
            <span>{cls.name}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{expandedClass === i ? '−' : '+'}</span>
          </button>
          
          {expandedClass === i && cls.description && (
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              {cls.description.substring(0, 200)}{cls.description.length > 200 ? '...' : ''}
            </p>
          )}
          
          {expandedClass === i && cls.methods.length > 0 && (
            <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Methods ({cls.methods.length})
              </h4>
              {cls.methods.map((method, j) => (
                <div key={j} className="api-method" style={{
                  background: 'var(--bg-tertiary)',
                  padding: '0.8rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem'
                }}>
                  <code style={{ color: 'var(--success)', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>
                    {method.name}({method.params.map(p => `${p.name}${p.type ? ': ' + p.type : ''}`).join(', ')})
                    {method.returns && <span style={{ color: 'var(--text-secondary)' }}> → {method.returns}</span>}
                  </code>
                  {method.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.3rem', lineHeight: '1.5' }}>
                      {method.description.substring(0, 150)}{method.description.length > 150 ? '...' : ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ApiDoc
