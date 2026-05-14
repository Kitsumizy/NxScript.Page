const nxscript = require('./nxscript.js');

// Crear VM
const vmId = nxscript.nxs_create();
console.log('VM created with ID:', vmId);

// Ejecutar código
const error1 = nxscript.nxs_run(vmId, 'var x = 5', 'test.nx');
if (error1) {
    console.error('Error running code:', error1);
} else {
    console.log('✓ Code executed successfully');
}

// Obtener valor de x (usar la función correcta para el tipo)
const xValue = nxscript.nxs_get_number(vmId, 'x');
console.log('Value of x:', xValue); // Should print 5

// Definir función correctamente (sintaxis NxScript, no JS)
const error2 = nxscript.nxs_run(vmId, 'func myFunc(arr) { return arr.reduce((a, b) => a + b, 0) }', 'test2.nx');
if (error2) {
    console.error('Error defining function:', error2);
} else {
    console.log('✓ Function defined');
}

// Llamar función - los args deben ser JSON
const result = nxscript.nxs_call(vmId, 'myFunc', JSON.stringify([[1, 2, 3]]));
console.log('Result of myFunc:', result);

// Si hay error en el call, empieza con __error__
if (result.startsWith('__error__')) {
    console.error('Function call error:', result);
} else {
    const parsed = JSON.parse(result);
    console.log('Parsed result:', parsed);
}

// Set globals
nxscript.nxs_set_number(vmId, 'score', 100);
nxscript.nxs_set_string(vmId, 'name', 'player');

// Get globals
console.log('score:', nxscript.nxs_get_number(vmId, 'score'));
console.log('name:', nxscript.nxs_get_string(vmId, 'name'));

// Sandbox (opcional)
// nxscript.nxs_sandbox(vmId);

// Liberar VM
nxscript.nxs_free(vmId);
console.log('✓ VM freed');
