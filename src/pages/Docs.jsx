import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function Docs() {
  const [activeDoc, setActiveDoc] = useState('getting-started')

  const docs = {
    'getting-started': {
      title: 'Getting Started',
      content: `
## Installation

\`\`\`bash
haxelib git nxscript https://github.com/senioritaelizabeth/NxScript.git
\`\`\`

## Quick Start

\`\`\`haxe
import nx.script.Interpreter;

var interp = new Interpreter();
interp.run('
    func greet(name) {
        return "Hello " + name + "!"
    }
');
trace(interp.call("greet", ["world"])); // Hello world!
\`\`\`

## Basic Syntax

### Variables

\`\`\`nx
var x = 10
let y = 20        // block-scoped
const MAX = 100   // immutable
\`\`\`

### Functions

\`\`\`nx
func add(a, b) {
    return a + b
}

// shorthand lambda
var double = x => x * 2
\`\`\`

### Control Flow

\`\`\`nx
if (x > 0) doThing()
else doOther()

while (i < 10) i++

for (item in array) trace(item)
\`\`\`
      `
    },
    'language-basics': {
      title: 'Language Basics',
      content: `
## Variables

\`\`\`nx
var x = 10      // mutable
let y = 20      // block-scoped
const Z = 30    // immutable
\`\`\`

## Data Types

- **Numbers**: \`42\`, \`3.14\`
- **Strings**: \`"hello"\`, \`'world'\`, \`\`backticks\`\`
- **Booleans**: \`true\`, \`false\`
- **Arrays**: \`[1, 2, 3]\`
- **Dicts**: \`{"key": "value"}\`
- **Null**: \`null\`

## Operators

\`\`\`nx
// Arithmetic
var sum = 5 + 3
var diff = 10 - 4
var product = 6 * 7
var quotient = 20 / 4
var remainder = 17 % 5

// Comparison
var eq = (5 == 5)      // true
var neq = (5 != 3)     // true
var lt = (3 < 5)       // true
var gt = (5 > 3)       // true

// Logical
var and = true && false
var or = true || false
var not = !true
\`\`\`
      `
    },
    'classes': {
      title: 'Classes & Methods',
      content: `
## Class Definition

\`\`\`nx
class Animal {
    var name
    var hp = 100

    func new(n) {
        this.name = n
    }

    func speak() {
        return this.name + " makes noise"
    }

    func takeDamage(amount) {
        this.hp -= amount
        return this.hp > 0
    }
}
\`\`\`

## Inheritance

\`\`\`nx
class Dog extends Animal {
    func new(n) { super.new(n) }
    func speak() { return this.name + " says woof" }
}

var d = new Dog("Rex")
trace(d.speak())        // Rex says woof
trace(d.takeDamage(30)) // true
trace(d.hp)             // 70
\`\`\`

## Static Members

\`\`\`nx
class Counter {
    static var count = 0
    
    func new() {
        Counter.count++
    }
    
    static func getCount() {
        return Counter.count
    }
}
\`\`\`
      `
    }
  }

  return (
    <div className="docs-container">
      <aside className="docs-sidebar">
        <h3>Documentation</h3>
        <ul>
          {Object.entries(docs).map(([key, doc]) => (
            <li key={key}>
              <button
                onClick={() => setActiveDoc(key)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeDoc === key ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  padding: '0.5rem 0'
                }}
              >
                {doc.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="docs-content">
        <ReactMarkdown>{docs[activeDoc].content}</ReactMarkdown>
      </div>
    </div>
  )
}

export default Docs
