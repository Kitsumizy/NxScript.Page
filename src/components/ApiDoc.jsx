import { useState, useEffect } from 'react'

function ApiDoc() {
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api.xml')
      .then(res => res.text())
      .then(xml => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, 'text/xml')
        
        // Parse classes
        const classes = []
        const classNodes = doc.querySelectorAll('class')
        classNodes.forEach(cls => {
          const methods = []
          const methodNodes = cls.querySelectorAll('method')
          methodNodes.forEach(method => {
            methods.push({
              name: method.getAttribute('name'),
              params: Array.from(method.querySelectorAll('param')).map(p => ({
                name: p.getAttribute('name'),
                type: p.getAttribute('type')
              })),
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

  if (loading) {
    return <div className="api-container">Loading API documentation...</div>
  }

  if (!apiData || apiData.classes.length === 0) {
    return <div className="api-container">No API documentation available</div>
  }

  return (
    <div className="api-container">
      <h1 style={{ marginBottom: '2rem', color: 'var(--accent)' }}>API Reference</h1>
      
      {apiData.classes.map((cls, i) => (
        <div key={i} className="api-class">
          <h2>{cls.name}</h2>
          {cls.description && <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{cls.description}</p>}
          
          {cls.methods.length > 0 && (
            <div>
              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Methods</h3>
              {cls.methods.map((method, j) => (
                <div key={j} className="api-method">
                  <h3>
                    {method.name}({method.params.map(p => `${p.name}: ${p.type}`).join(', ')})
                    {method.returns && ` → ${method.returns}`}
                  </h3>
                  {method.description && <p>{method.description}</p>}
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
