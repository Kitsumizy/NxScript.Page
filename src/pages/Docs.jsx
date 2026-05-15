import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

function Docs() {
  const [activeDoc, setActiveDoc] = useState('why-nxscript')

  const docs = {
    'why-nxscript': {
      title: 'Why Use NxScript?',
      content: `
NxScript is a scripting language built on Haxe, designed to be **accessible and fast** across all Haxe targets — and even beyond.

## Our Philosophy

> ## WE ARE NOT TRYING TO COMPETE WITH ANYTHING OR ANYONE

NxScript doesn't aim to replace [HScript](https://lib.haxe.org/p/hscript/), [HScript-Iris](https://lib.haxe.org/p/hscript-iris/), or any other scripting solution. 

**We just want to provide a fun, easy-to-use scripting experience for everyone.** :3

Whether you're a game developer needing runtime scripting, a programmer prototyping mechanics, or someone learning to code — NxScript is here to help, not to compete.

## Key Benefits

### 1. **Accessible Syntax**
Clean, JavaScript-like syntax that's easy to learn:
\`\`\`js
var player = { hp: 100, name: "Hero" }

func attack(target, damage) {
    target.hp -= damage
    return target.hp > 0
}
\`\`\`

### 2. **Fast Execution**
Bytecode-compiled VM with optimizations:
- Constant folding at compile time
- Dead code elimination (DCE)
- Per-class method caching
- Optimized iterators (no Map allocations)

### 3. **Full Haxe Integration**
Seamlessly call Haxe code from scripts and vice versa:
\`\`\`haxe
interp.globals.set("game", interp.vm.haxeToValue(this));
\`\`\`

### 4. **Cross-Platform**
Runs anywhere Haxe compiles:
- HashLink (HL)
- C++ (native)
- JavaScript (web)
- And more...
      `
    },
    'getting-started': {
      title: 'Getting Started',
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

## CLI Usage

\`\`\`bash
# Run a script
haxelib run nxscript run myscript.nx

# Watch mode (auto-reload on changes)
haxelib run nxscript run myscript.nx -w

# Interactive REPL
haxelib run nxscript repl

# Run tests
haxelib run nxscript test
\`\`\`

## Basic Syntax

### Variables

\`\`\`js
var x = 10          // mutable
let y = 20          // block-scoped
const MAX = 100     // immutable
\`\`\`

### Functions

\`\`\`js
func add(a, b) {
    return a + b
}

// Shorthand lambda
var double = x => x * 2
\`\`\`

### Control Flow

\`\`\`js
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
var x = 10      // mutable, function-scoped
let y = 20      // block-scoped
const Z = 30    // immutable, compile-time constant
\`\`\`

## Data Types

### Numbers
\`42\`, \`3.14\`, \`-17\`

### Strings
\`"hello"\`, \`'world'\`, template strings

### Booleans
\`true\`, \`false\`

### Arrays
\`[1, 2, 3]\`, \`["a", "b"]\`

### Dicts
\`{"key": "value"}\`

### Null
\`null\`

## Operators

### Arithmetic

\`\`\`js
var sum = 5 + 3       // 8
var diff = 10 - 4     // 6
var product = 6 * 7   // 42
var quotient = 20 / 4 // 5
var remainder = 17 % 5 // 2
\`\`\`

### Comparison

\`\`\`js
var eq = (5 == 5)    // true
var neq = (5 != 3)   // true
var lt = (3 < 5)     // true
var gt = (5 > 3)     // true
var lte = (5 <= 5)   // true
var gte = (5 >= 3)   // true
\`\`\`

### Logical

\`\`\`js
var and = true && false  // false
var or = true || false   // true
var not = !true          // false
\`\`\`

### Null Coalescing

\`\`\`js
var name = userInput ?? "anonymous"
var port = config.port ?? 8080
\`\`\`

### Optional Chaining

\`\`\`js
var city = user?.address?.city
var tag = node?.children?.first() ?? "none"
\`\`\`

## Template Strings

\`\`\`js
var name = "World"
var msg = \`Hello \${name}! Result: \${2 + 2}\`
trace(msg) // "Hello World! Result: 4"
\`\`\`

## Trailing Commas

\`\`\`js
var arr = [1, 2, 3,]
var obj = {"a": 1, "b": 2,}
func foo(a, b,) {}
\`\`\`
      `
    },
    'classes': {
      title: 'Classes & Objects',
      content: `
## Class Definition

\`\`\`js
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

\`\`\`js
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

\`\`\`js
class Counter {
    static var count = 0
    
    func new() {
        Counter.count++
    }
    
    static func getCount() {
        return Counter.count
    }
}

var c1 = new Counter()
var c2 = new Counter()
trace(Counter.getCount()) // 2
\`\`\`

## Enums

\`\`\`js
enum Direction { North, South, East, West }
enum Result { Ok(value), Err(message) }

var dir = Direction["North"]
var ok = Result["Ok"](42)

match ok {
    case Ok(v) => trace("Success: " + v)
    case Err(e) => trace("Error: " + e)
}
\`\`\`

## Extending Native Haxe Classes

\`\`\`js
class MySprite extends flixel.FlxSprite {
    func new(x, y) {
        super.new(x, y)
        this.makeGraphic(32, 32, 0xFFFF0000)
    }
    
    func update() {
        this.x += 1
    }
}
\`\`\`
      `
    },
    'pattern-matching': {
      title: 'Pattern Matching',
      content: `
## Match Expression

\`\`\`js
match score {
    case 90...100 => "A"
    case 80...89  => "B"
    case 70...79  => "C"
    default       => "F"
}
\`\`\`

## Type Matching

\`\`\`js
match value {
    case String  => "is a string"
    case Number  => "is a number"
    case Bool    => "is a boolean"
    case Array   => "is an array"
    case n       => "unknown: " + n
}
\`\`\`

## Switch (alias for match)

\`\`\`js
switch cmd {
    case "attack" => dealDamage()
    case "flee"   => runAway()
    case "item"   => useItem()
    default       => trace("unknown command")
}
\`\`\`

## Array Destructuring

\`\`\`js
match [10, 20, 30] {
    case [a, b]     => a + b       // 30
    case [a, b, c]  => a + b + c   // 60
    default         => 0
}
\`\`\`

## Destructuring Assignment

\`\`\`js
// Array destructuring
var [a, b, _] = [1, 2, 3]
trace(a) // 1
trace(b) // 2
// _ skips the third element

// Dict destructuring
var {x, y} = {"x": 10, "y": 20}
trace(x) // 10
trace(y) // 20
\`\`\`
      `
    },
    'imports': {
      title: 'Imports & Modules',
      content: `
## Import Syntax

\`\`\`js
// Import another NxScript file
import "./Enemy.nx"
import "../utils/helpers.nx"

// Import with alias
import "./Player.nx" as P

// import haxe standard library (limited in sandbox)
import path.to.module.Module

\`\`\`

## Runtime Script Loading

### Load a Single Script

\`\`\`haxe
var mod = interp.loadScript("assets/scripts/Enemy.nx");
var enemy = interp.vm.callResolved(mod["Enemy"], []);
\`\`\`

### Load All Scripts in Directory

\`\`\`haxe
// Load all .nx files in a folder
interp.loadScripts("assets/scripts/");

// Now you can use any class from those scripts
interp.run('var e = new Enemy()');
\`\`\`

### Preserving State Across Resets

\`\`\`haxe
// Load scripts first
interp.loadScripts("assets/scripts/");

// Reset clears instance state but keeps classes/statics
interp.reset_context();

// Classes are still available
interp.run('var p = new Player()');
\`\`\`

## Script-to-Script Imports

When one script imports another:

\`\`\`js
// player.nx
import "./base.nx"

class Player extends Entity {
    var hp = 100
}
\`\`\`

The import is processed at compile time, and the imported script's classes become available.
      `
    },
    'haxe-integration': {
      title: 'Haxe Integration',
      content: `
## Access Haxe Objects from Scripts

\`\`\`haxe
// Expose a Haxe object to scripts
interp.globals.set("game", interp.vm.haxeToValue(this));
\`\`\`

\`\`\`js
// In script
game.addSprite(sprite)
game.score = 100
\`\`\`

## Create Script Class Instances in Haxe

\`\`\`haxe
// Define class in script
interp.run('
    class Enemy {
        var hp = 100
        func takeDamage(n) { this.hp -= n }
    }
');

// Create instance from Haxe
var enemy:Dynamic = interp.createInstance("Enemy");
enemy.takeDamage(30);
trace(enemy.hp); // 70
\`\`\`

### Type-Safe Instance with Interface

\`\`\`haxe
interface IEnemy {
    var hp:Int;
    function takeDamage(n:Int):Void;
}

var enemy:IEnemy = interp.createInstance("Enemy");
// Now you get IDE autocomplete!
enemy.takeDamage(30);
\`\`\`

## NativeProxy for Hot Loops

For performance-critical loops, use NativeProxy to avoid reflection overhead:

\`\`\`haxe
// Wrap many objects at once
var result = interp.wrapNativeMany(sprites, ["x", "y", "angle", "color"]);
interp.globals.set("sprites", result.value);

// Run script that modifies all sprites
interp.run('
    for (spr in sprites) {
        spr.x += 1
        spr.angle = sin(time) * 45
    }
');

// Flush changes back to native objects
NativeProxy.flushAll(result.proxies);
\`\`\`

## Per-Frame Function Calls

\`\`\`haxe
// Resolve callable once
var updateFn = interp.resolveCallable("update");

// Every frame, call with new arguments
var args = [interp.vm.haxeToValue(elapsed)];
interp.vm.callResolved(updateFn, args);
\`\`\`

## nativeForEach - Batch Processing

\`\`\`haxe
// Define update function in script
interp.run('
    func updateSprite(spr, i, dt) {
        spr.angle += 120 * dt
        spr.x += 60 * dt * sin(i)
    }
');

// Call from Haxe for each sprite
var fn = interp.resolveCallable("updateSprite");
interp.nativeForEach(sprites, fn, [interp.vm.haxeToValue(dt)]);
\`\`\`
      `
    },
    'optimization': {
      title: 'Optimization & DCE',
      content: `
## Compiler Optimizations

NxScript includes several compile-time optimizations:

### Constant Folding

Expressions with known values are computed at compile time:

\`\`\`js
var x = 2 + 3 * 4  // Compiled as: var x = 14
\`\`\`

### Dead Code Elimination (DCE)

Unused code is removed during compilation:

\`\`\`js
func neverCalled() {
    trace("This is removed if never used")
}

var used = 42  // This stays
\`\`\`

## Runtime Optimizations

### Method Caching

The VM caches method lookups per class:

\`\`\`js
class Player {
    func update() {
        this.x += 1  // Member access is cached
    }
}
\`\`\`

### Optimized Iterators

Range-based for loops use optimized iterators:

\`\`\`js
// No Map allocation per iteration
for (i in 0...100) {
    process(i)
}
\`\`\`

### VIterator

Array iteration uses \`VIterator\` instead of Map allocations:

\`\`\`js
for (item in array) {
    // Uses single Array<Int>[1] box instead of 3-entry Map
    process(item)
}
\`\`\`

## GC Control

Control when VM internal caches are flushed:

\`\`\`haxe
import nx.script.GcKind;

var interp = new Interpreter();

// Aggressive: flush every execute()
interp.gc_kind = GcKind.AGGRESSIVE;

// Soft: flush when object count > threshold (default)
interp.gc_kind = GcKind.SOFT;
interp.gc_softThreshold = 512;

// Very Soft: never flush proactively
interp.gc_kind = GcKind.VERY_SOFT;

// Manual flush
interp.gc();
\`\`\`

## Enable Optimizations

\`\`\`haxe
var interp = new Interpreter();
interp.optimize = true;              // Enable all optimizations
interp.optimizeDCE = true;           // Dead code elimination
interp.optimizeConstantFolding = true;
interp.optimizePeephole = true;

interp.run(sourceCode);
\`\`\`

## Bytecode Serialization

Compile once, run multiple times:

\`\`\`haxe
// Compile to bytecode
var chunk = interp.compile(sourceCode);
var bytes = interp.serialize(chunk);

// Save bytes to file...

// Later, load and run
var loaded = interp.deserialize(bytes);
interp.runChunk(loaded);
\`\`\`
      `
    },
    'sandbox': {
      title: 'Sandbox Mode',
      content: `
## Enable Sandbox

Restrict script access to dangerous APIs:

\`\`\`haxe
var interp = new Interpreter();
interp.enableSandbox();

// Or with custom blocklist
interp.enableSandbox(["MyCustomClass"]);
\`\`\`

## What's Blocked

Sandbox mode blocks:

- **Filesystem**: \`sys.io.File\`, \`FileSystem\`
- **Network**: \`haxe.Http\`, \`Socket\`
- **Process**: \`Sys.process\`
- **Reflection**: \`Reflect\`, \`Type\` (limited)

## Instruction Limits

Sandbox also sets limits:

- \`maxInstructions = 500,000\` - Prevents infinite loops
- \`maxCallDepth = 256\` - Prevents stack overflow

## Safe Call APIs

\`\`\`haxe
// Returns null on error instead of throwing
var result = interp.safeCall("maybeRisky", []);
if (result == null) {
    trace("Call failed safely");
}

// Safe global access
var value = interp.vm.safeGet("maybeUndefined");
\`\`\`

## Use Cases

- User-generated content
- Mod support
- Untrusted script execution
- Testing environments
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
      <aside style={{ 
        background: 'var(--bg-secondary)', 
        borderRadius: '12px', 
        padding: '1.5rem',
        border: '1px solid var(--border)',
        height: 'fit-content',
        position: 'sticky',
        top: '2rem',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto'
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
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
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
                {doc.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="docs-content" style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '2.5rem',
        border: '1px solid var(--border)',
        minHeight: 'calc(100vh - 200px)',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <h1 style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '0.5rem' }}>
            {docs[activeDoc].title}
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
                  customStyle={{
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    lineHeight: '1.5'
                  }}
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
            blockquote({children}) {
              return (
                <blockquote style={{
                  borderLeft: '3px solid var(--accent)',
                  paddingLeft: '1.5rem',
                  margin: '1.5rem 0',
                  color: 'var(--text-primary)',
                  fontStyle: 'italic'
                }}>
                  {children}
                </blockquote>
              )
            },
            h2({children}) {
              return (
                <h2 style={{
                  color: 'var(--text-primary)',
                  fontSize: '1.5rem',
                  marginTop: '2rem',
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
                  fontSize: '1.2rem',
                  marginTop: '1.5rem',
                  marginBottom: '0.75rem'
                }}>
                  {children}
                </h3>
              )
            },
            p({children}) {
              return (
                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.7',
                  marginBottom: '1rem',
                  fontSize: '0.95rem'
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
                  marginBottom: '0.4rem',
                  lineHeight: '1.6'
                }}>
                  {children}
                </li>
              )
            },
            table({children}) {
              return (
                <div style={{
                  overflowX: 'auto',
                  margin: '1.5rem 0'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.9rem'
                  }}>
                    {children}
                  </table>
                </div>
              )
            },
            th({children}) {
              return (
                <th style={{
                  background: 'var(--bg-tertiary)',
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '2px solid var(--border)',
                  color: 'var(--accent)'
                }}>
                  {children}
                </th>
              )
            },
            td({children}) {
              return (
                <td style={{
                  padding: '0.6rem 0.75rem',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-secondary)'
                }}>
                  {children}
                </td>
              )
            }
          }}
        />
      </div>
    </div>
  )
}

export default Docs
