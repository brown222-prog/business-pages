const bcrypt = require('bcryptjs');

// The password we want to use
const password = 'Circulair@3';

// Test 1: Generate a fresh hash and test it
console.log('=== Test 1: Fresh hash ===');
const freshHash = bcrypt.hashSync(password, 10);
console.log('Generated hash:', freshHash);
console.log('Immediate verification:', bcrypt.compareSync(password, freshHash));

// Test 2: Use the hash from .env.local
console.log('\n=== Test 2: Hash from .env.local ===');
const envHash = '$2b$10$pC5snPXQ1JBXvCs9VF.MKeuFixYQoPtKwfVKG9dVwgQpgJv2nXvg2';
console.log('Env hash:', envHash);
console.log('Verification:', bcrypt.compareSync(password, envHash));

// Test 3: Try async
console.log('\n=== Test 3: Async test ===');
bcrypt.compare(password, freshHash).then(result => {
  console.log('Fresh hash async:', result);
});

bcrypt.compare(password, envHash).then(result => {
  console.log('Env hash async:', result);
});
