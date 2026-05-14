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
          const methods = []
          const methodNodes = cls.querySelectorAll('method')
          methodNodes.forEach(method => {
            const params = []
            method.querySelectorAll('param').forEach(p => {
              params.push({
                name: p.getAttribute('name'),
                type: p.getAttribute('type')
              })
            })
            methods.push({
              name: method.getAttribute('name'),
              params: params,
              returns: method.getAttribute('returns'),
              description: method.querySelector('description')?.textContent || ''
            })
          })

          classes.push({
            name: cls.getAttribute('name'),
            file: cls.getAttribute('file'),
            description: cls.querySelector('description')?.textContent || '',
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
      
      {apiData.classes.map((cls, i) => (
        <div key={i} className="api-class" style={{ 
          marginBottom: '1rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '1rem'
        }}>
          <button 
            onClick={() => toggleClass(i)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{cls.name}</span>
            <span>{expandedClass === i ? '−' : '+'}</span>
          </button>
          
          {cls.description && expandedClass === i && (
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{cls.description}</p>
          )}
          
          {expandedClass === i && cls.methods.length > 0 && (
            <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Methods</h4>
              {cls.methods.map((method, j) => (
                <div key={j} className="api-method" style={{
                  background: 'var(--bg-tertiary)',
                  padding: '0.8rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem'
                }}>
                  <code style={{ color: 'var(--success)', fontSize: '0.9rem' }}>
                    {method.name}({method.params.map(p => `${p.name}${p.type ? ': ' + p.type : ''}`).join(', ')})
                    {method.returns && <span style={{ color: 'var(--text-secondary)' }}> → {method.returns}</span>}
                  </code>
                  {method.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                      {method.description}
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
