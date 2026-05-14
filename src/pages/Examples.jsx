function Examples() {
  const examples = [
    {
      title: 'Hello World',
      code: `trace("Hello NxScript!")`,
      output: 'Hello NxScript!'
    },
    {
      title: 'Variables & Functions',
      code: `var x = 5
var y = 10

func add(a, b) {
    return a + b
}

trace(add(x, y))`,
      output: '15'
    },
    {
      title: 'Arrays',
      code: `var arr = [1, 2, 3, 4, 5]

// map
var doubled = arr.map(x => x * 2)
trace(doubled)

// filter
var evens = arr.filter(x => x % 2 == 0)
trace(evens)

// reduce
var sum = arr.reduce((a, x) => a + x, 0)
trace(sum)`,
      output: '[2,4,6,8,10]\n[2,4]\n15'
    },
    {
      title: 'Classes',
      code: `class Player {
    var hp = 100
    var name

    func new(n) {
        this.name = n
    }

    func takeDamage(n) {
        this.hp -= n
    }

    func isAlive() {
        return this.hp > 0
    }
}

var p = new Player("Hero")
p.takeDamage(30)
trace(p.name + " HP: " + p.hp)
trace("Alive: " + p.isAlive())`,
      output: 'Hero HP: 70\nAlive: true'
    },
    {
      title: 'Match/Switch',
      code: `var score = 85

match score {
    case 90...100 => trace("A")
    case 80...89  => trace("B")
    case 70...79  => trace("C")
    default       => trace("F")
}`,
      output: 'B'
    },
    {
      title: 'Null Coalescing',
      code: `var name = null
var actual = name ?? "anonymous"
trace(actual)

var config = {"port": 8080}
var port = config.port ?? 3000
trace(port)`,
      output: 'anonymous\n8080'
    }
  ]

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Examples</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Browse examples to learn NxScript syntax and features.
      </p>
      
      <div className="features">
        {examples.map((ex, i) => (
          <div key={i} className="feature-card" style={{ gridColumn: 'span 2' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{ex.title}</h3>
            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <pre style={{ margin: 0, overflowX: 'auto', fontSize: '0.85rem' }}>
                <code>{ex.code}</code>
              </pre>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Output:</strong>
              <pre style={{ margin: '0.5rem 0 0', color: 'var(--success)', fontSize: '0.9rem' }}>
                {ex.output}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Examples
