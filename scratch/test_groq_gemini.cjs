const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../api/.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function testGroq() {
  console.log('\n--- TESTING GROQ openai/gpt-oss-120b ---');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: 'Say OK' }],
      max_tokens: 5
    })
  });
  console.log('Status:', res.status);
  console.log('Headers:');
  for (const [k, v] of res.headers.entries()) {
    if (k.includes('ratelimit') || k.includes('retry') || k.includes('request-id')) {
      console.log(`  ${k}: ${v}`);
    }
  }
  const data = await res.json();
  console.log('Body usage:', data.usage);
  console.log('Response content:', data.choices?.[0]?.message?.content || data);
}

async function testGeminiNative() {
  console.log('\n--- TESTING GEMINI NATIVE gemini-2.5-flash ---');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Say OK' }] }],
      generationConfig: { maxOutputTokens: 5 }
    })
  });
  console.log('Gemini Native Status:', res.status);
  for (const [k, v] of res.headers.entries()) {
    if (k.includes('ratelimit') || k.includes('retry') || k.includes('quota')) {
      console.log(`  ${k}: ${v}`);
    }
  }
  const data = await res.json();
  console.log('Gemini Native Data:', JSON.stringify(data, null, 2).slice(0, 500));
}

async function testGeminiOpenAI() {
  console.log('\n--- TESTING GEMINI OPENAI COMPAT gemini-2.5-flash ---');
  // For Gemini's OpenAI compat, Authorization header or api-key header:
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gemini-2.5-flash',
      messages: [{ role: 'user', content: 'Say OK' }],
      max_tokens: 5
    })
  });
  console.log('Gemini OpenAI Compat Status:', res.status);
  for (const [k, v] of res.headers.entries()) {
    if (k.includes('ratelimit') || k.includes('retry') || k.includes('quota')) {
      console.log(`  ${k}: ${v}`);
    }
  }
  const text = await res.text();
  console.log('Gemini OpenAI text:', text.slice(0, 400));
}

async function main() {
  await testGroq();
  await testGeminiNative();
  await testGeminiOpenAI();
}

main();
