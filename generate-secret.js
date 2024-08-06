import crypto from 'crypto';

function generateSecureString(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

const secureString = generateSecureString();
console.log('Your secure string:', secureString);