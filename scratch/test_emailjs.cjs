const dotenv = require('dotenv');
dotenv.config();

const serviceId = process.env.VITE_EMAILJS_SERVICE_ID;
const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY;

console.log('Testing EmailJS with keys:');
console.log('Service ID:', serviceId);
console.log('Template ID:', templateId);
console.log('Public Key:', publicKey);

async function testSubmit() {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          from_name: 'Test Sender',
          from_email: 'test@example.com',
          phone: '1234567890',
          website: 'test.com',
          platform: 'shopify',
          budget: 'tier1',
          message: 'Hello, this is a test message to verify EmailJS configuration.',
        },
      }),
    });

    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

testSubmit();
