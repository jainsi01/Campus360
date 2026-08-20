const path = require('path');
const dotenv = require('dotenv');

// Resolve from this file so startup does not depend on the shell's working directory.
const envPath = path.resolve(__dirname, '../../.env');
const result = dotenv.config({ path: envPath });

if (result.error && result.error.code !== 'ENOENT') {
  console.warn(`Unable to load backend environment file at ${envPath}: ${result.error.code || result.error.name}`);
}

console.log('Gemini API key configured:', Boolean(process.env.GEMINI_API_KEY));
console.log('Gemini model:', process.env.GEMINI_MODEL || 'not configured');

module.exports = { envPath };
