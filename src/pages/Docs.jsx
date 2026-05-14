import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

function Docs() {
  const [activeDoc, setActiveDoc] = useState('getting-started')

  const docs = {
    'getting-started': {
      title: 'Getting Started',
      icon: '🚀',
      content: `
## Installation

\`\`\`bash
haxelib git nxscript https://github.com/senioritaelizabeth/NxScript.git
\`\`\`

Add to your \`build.hxml\`:

\`\`\`hxml
-lib nxscript
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
      icon: '📚',
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

## Null Coalescing

\`\`\`nx
var name = userInput ?? "anonymous"
var port = config.port ?? 8080
\`\`\`

## Optional Chaining

\`\`\`nx
var city = user?.address?.city
var tag = node?.children?.first() ?? "none"
\`\`\`
      `
    },
    'classes': {
      title: 'Classes & Methods',
      icon: '🏗️',
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

## Enums

\`\`\`nx
enum Direction { North, South, East, West }
enum Result { Ok(value), Err(message) }

var dir = Direction["North"]
var ok = Result["Ok"](42)
\`\`\`
      `
    },
    'match': {
      title: 'Pattern Matching',
      icon: '🎯',
      content: `
## Match Expression

\`\`\`nx
match score {
    case 90...100 => "A"
    case 80...89  => "B"
    case 70...79  => "C"
    default       => "F"
}
\`\`\`

## Type Matching

\`\`\`nx
match value {
    case String  => "is a string"
    case Number  => "is a number"
    case n       => "bound: " + n
}
\`\`\`

## Switch (alias for match)

\`\`\`nx
switch cmd {
    case "attack" => dealDamage()
    case "flee"   => runAway()
    default       => trace("unknown")
}
\`\`\`

## Array Destructuring

\`\`\`nx
match [10, 20, 30] {
    case [a, b]     => a + b
    case [a, b, c]  => a + b + c
    default         => 0
}
\`\`\`
      `
    },
    'haxe-integration': {
      title: 'Haxe Integration',
      icon: '🔗',
      content: `
## Expose Haxe Objects

\`\`\`haxe
interp.globals.set("game", interp.vm.haxeToValue(this));
\`\`\`

\`\`\`nx
# In script
game.addSprite(sprite)
game.score = 100
\`\`\`

## NxProxy - Script Class Instances

\`\`\`haxe
interp.run('
    class Enemy {
        var hp = 100
        func takeDamage(n) { this.hp -= n }
    }
');

var enemy:Dynamic = NxProxy.instantiate(interp, "Enemy", []);
enemy.takeDamage(30);
trace(enemy.hp); // 70
\`\`\`

## NativeProxy - Hot Loop Optimization

\`\`\`haxe
var result = NativeProxy.wrapMany(vm, sprites, ["x","y","angle","color"]);
vm.globals.set("sprites", VArray(result.values));

interp.run(script);

NativeProxy.flushAll(result.proxies);
\`\`\`

## Per-Frame Calls

\`\`\`haxe
var updateFn = interp.vm.resolveCallable("update");
var args = [VNumber(0.0)];

// every frame:
args[0] = VNumber(elapsed);
interp.vm.callResolved(updateFn, args);
\`\`\`
      `
    }
  }

  return (
    <div className="docs-container" style={{ 
      display: 'grid', 
      gridTemplateColumns: '280px 1fr', 
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Sidebar */}
      <aside style={{ 
        background: 'var(--bg-secondary)', 
        borderRadius: '12px', 
        padding: '1.5rem',
        border: '1px solid var(--border)',
        height: 'fit-content',
        position: 'sticky',
        top: '2rem'
      }}>
        <h3 style={{ color: 'var(--accent)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
          Documentation
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {Object.entries(docs).map(([key, doc]) => (
            <li key={key} style={{ marginBottom: '0.25rem' }}>
              <button
                onClick={() => setActiveDoc(key)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.6rem 0.8rem',
                  background: activeDoc === key ? 'var(--accent)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: activeDoc === key ? '#000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (activeDoc !== key) {
                    e.target.style.background = 'var(--bg-tertiary)'
                    e.target.style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeDoc !== key) {
                    e.target.style.background = 'transparent'
                    e.target.style.color = 'var(--text-secondary)'
                  }
                }}
              >
                <span>{doc.icon}</span>
                <span>{doc.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <div className="docs-content" style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '2.5rem',
        border: '1px solid var(--border)',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <h1 style={{ color: 'var(--accent)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {docs[activeDoc].icon} {docs[activeDoc].title}
          </h1>
        </div>
        
        <ReactMarkdown
          children={docs[activeDoc].content}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
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
            pre({children}) {
              return <div style={{ margin: '1.5rem 0' }}>{children}</div>
            },
            h2({children}) {
              return (
                <h2 style={{
                  color: 'var(--text-primary)',
                  fontSize: '1.8rem',
                  marginTop: '2.5rem',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid var(--border)'
                }}>
                  {children}
                </h2>
              )
            },
            h3({children}) {
              return (
                <h3 style={{
                  color: 'var(--text-primary)',
                  fontSize: '1.4rem',
                  marginTop: '2rem',
                  marginBottom: '0.8rem'
                }}>
                  {children}
                </h3>
              )
            },
            p({children}) {
              return (
                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.8',
                  marginBottom: '1rem',
                  fontSize: '1.05rem'
                }}>
                  {children}
                </p>
              )
            },
            ul({children}) {
              return (
                <ul style={{
                  marginBottom: '1rem',
                  paddingLeft: '1.5rem',
                  color: 'var(--text-secondary)'
                }}>
                  {children}
                </ul>
              )
            },
            li({children}) {
              return (
                <li style={{
                  marginBottom: '0.5rem',
                  lineHeight: '1.6'
                }}>
                  {children}
                </li>
              )
            }
          }}
        />
      </div>
    </div>
  )
}

export default Docs
