import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'

function TryEditor() {
  const [code, setCode] = useState(`// NxScript REPL
var x = 5
var y = 10

func add(a, b) {
    return a + b
}

trace("x + y = " + add(x, y))

class Player {
    var hp = 100
    func takeDamage(n) {
        this.hp -= n
    }
}

var p = new Player(100)
trace("Player HP: " + p.hp)
`)
  const [output, setOutput] = useState([])
  const [interp, setInterp] = useState(null)

  useEffect(() => {
    // Intercept console.log to capture trace output
    const originalLog = console.log
    const originalError = console.error
    
    console.log = (...args) => {
      const msg = args.map(a => String(a)).join(' ')
      setOutput(prev => [...prev, { type: 'info', text: msg }])
      originalLog(...args)
    }
    
    console.error = (...args) => {
      const msg = args.map(a => String(a)).join(' ')
      setOutput(prev => [...prev, { type: 'error', text: msg }])
      originalError(...args)
    }
    
    if (window.nxs_create) {
      const vmId = window.nxs_create()
      setInterp({ vmId, ready: true })
      return
    }
    
    const script = document.createElement('script')
    script.src = 'NxScript.Page/nxscript.js'
    script.async = true
    
    script.onload = () => {
      console.log('nxscript.js loaded, checking for nxs_create...')
      if (window.nxs_create) {
        const vmId = window.nxs_create()
        console.log('Created VM with id:', vmId)
        setInterp({ vmId, ready: true })
      } else {
        console.error('nxs_create not found after script load. window keys:', Object.keys(window).filter(k => k.startsWith('nxs')))
        setOutput(prev => [...prev, { type: 'error', text: 'Failed to initialize NxScript runtime' }])
      }
    }
    
    script.onerror = () => {
      console.error('Failed to load nxscript.js')
      setOutput(prev => [...prev, { type: 'error', text: 'Failed to load NxScript runtime' }])
    }
    
    document.head.appendChild(script)

    return () => {
      console.log = originalLog
      console.error = originalError
      if (interp && window.nxs_free) {
        window.nxs_free(interp.vmId)
      }
    }
  }, [])

  const runCode = () => {
    if (!interp || !interp.ready) {
      setOutput(prev => [...prev, { type: 'error', text: 'Interpreter not loaded yet...' }])
      return
    }

    setOutput([])
    setOutput(prev => [...prev, { type: 'info', text: 'Running...' }])

    try {
      const error = window.nxs_run(interp.vmId, code, 'repl.nx')
      if (error && error.length > 0) {
        setOutput(prev => [...prev, { type: 'error', text: error }])
      }
    } catch (e) {
      setOutput(prev => [...prev, { type: 'error', text: e.message || String(e) }])
    }
  }

  const clearOutput = () => {
    setOutput([])
  }

  const loadExample = (value) => {
    if (value) {
      setCode(value)
    }
  }

  return (
    <div className="try-container">
      <div className="try-editor">
        <div className="try-controls">
          <button className="btn btn-primary" onClick={runCode}>Run ▶</button>
          <button className="btn btn-secondary" onClick={clearOutput}>Clear</button>
          <select 
            className="btn btn-secondary" 
            onChange={(e) => loadExample(e.target.value)}
            value=""
          >
            <option value="" disabled>Load Example...</option>
            <option value={`var x = 5\ntrace(x)`}>Variables</option>
            <option value={`func add(a, b) {\n    return a + b\n}\ntrace(add(3, 4))`}>Functions</option>
            <option value={`class Player {\n    var hp = 100\n    func takeDamage(n) {\n        this.hp -= n\n    }\n}\n\nvar p = new Player()\ntrace(p.hp)`}>Classes</option>
          </select>
        </div>
        <Editor
          height="60vh"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      <div className="try-output">
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Output</h3>
        <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
          {output.length === 0 ? (
            <span style={{ color: 'var(--text-secondary)' }}>Run code to see output...</span>
          ) : (
            output.map((line, i) => (
              <div key={i} className={
                line.type === 'error' ? 'output-error' : 
                line.type === 'success' ? 'output-success' : 
                'output-info'
              }>
                {line.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TryEditor
