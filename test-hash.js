const bcrypt = require('bcryptjs');

const password = 'Circulair@3';

console.log('Testing password:', password);
console.log('');

// Generate hash
const hash = bcrypt.hashSync(password, 10);
console.log('Generated hash:', hash);

// Test immediately
const syncResult = bcrypt.compareSync(password, hash);
console.log('Sync compare result:', syncResult);

bcrypt.compare(password, hash).then(asyncResult => {
  console.log('Async compare result:', asyncResult);

  if (syncResult && asyncResult) {
    console.log('');
    console.log('✓ SUCCESS - Hash is working!');
    console.log('');
    console.log('Update your .env.local with:');
    console.log('ADMIN_PASSWORD_HASH=' + hash);
  } else {
    console.log('✗ FAILED - Something is wrong');
  }
});
