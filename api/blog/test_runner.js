const handler = require('./generate.js');

// Mock request and response objects for local testing
const req = {
  headers: {
    authorization: 'Bearer local_cron_secret_key_123'
  },
  query: {}
};

const res = {
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log('--- TEST RUNNER COMPLETED ---');
    console.log('STATUS CODE:', this.statusCode);
    console.log('RESPONSE:', JSON.stringify(data, null, 2));
  }
};

console.log('Starting automated blog generation test locally...');
handler(req, res).catch(err => {
  console.error('Unhandled error in generation handler:', err);
});
