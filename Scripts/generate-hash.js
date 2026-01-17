const bcrypt = require('bcryptjs');

const password = 'Circulair@3'; // CHANGE THIS
const hash = bcrypt.hashSync(password, 10);

console.log('Testing hash generation and verification...');
console.log('Password:', password);
console.log('Hash:', hash);

// Test immediately with sync
const syncTest = bcrypt.compareSync(password, hash);
console.log('Sync verification:', syncTest);

// Test with async
bcrypt.compare(password, hash).then(asyncTest => {
  console.log('Async verification:', asyncTest);

  if (syncTest && asyncTest) {
    console.log('\n✓ Hash is valid!');
    console.log('\nAdd this to your .env.local:');
    console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  } else {
    console.log('\n✗ Hash verification failed!');
  }
});
