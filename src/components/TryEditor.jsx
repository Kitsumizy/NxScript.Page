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
    // Load nxscript.js from public folder
    const script = document.createElement('script')
    script.src = '/nxscript.js'
    script.onload = () => {
      if (window.nxs_create) {
        const vmId = window.nxs_create()
        setInterp({ vmId, ready: true })
      }
    }
    document.head.appendChild(script)

    return () => {
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

    try {
      const error = window.nxs_run(interp.vmId, code, 'repl.nx')
      if (error) {
        setOutput(prev => [...prev, { type: 'error', text: error }])
      } else {
        setOutput(prev => [...prev, { type: 'success', text: '✓ Code executed' }])
      }
    } catch (e) {
      setOutput(prev => [...prev, { type: 'error', text: e.message }])
    }
  }

  const clearOutput = () => {
    setOutput([])
  }

  const loadExample = (example) => {
    setCode(example)
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
            <option value="var x = 5\ntrace(x)">Variables</option>
            <option value="func add(a, b) {\n    return a + b\n}\ntrace(add(3, 4))">Functions</option>
            <option value="class Player {\n    var hp = 100\n    func takeDamage(n) {\n        this.hp -= n\n    }\n}\n\nvar p = new Player()\ntrace(p.hp)">Classes</option>
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
              <div key={i} className={line.type === 'error' ? 'output-error' : 'output-success'}>
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
