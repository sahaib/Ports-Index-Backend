import crypto from 'crypto';

const generateApiKey = () => {
  const buffer = crypto.randomBytes(32);
  return buffer.toString('hex');
};

console.log('Generated API Key:', generateApiKey()); 