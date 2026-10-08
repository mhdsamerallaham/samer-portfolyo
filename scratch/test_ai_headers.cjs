const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../api/.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function testProvider(name, url, key, model, extraHeaders = {}) {
  console.log(`\n=== Testing ${name} (${model}) ===`);
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders
  };
  if (key) headers['Authorization'] = `Bearer ${key}`;

  const body = {
    model,
    messages: [{ role: 'user', content: 'Say "OK"' }],
    max_tokens: 5,
  };

  try {
    const start = Date.now();
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    const duration = Date.now() - start;

    console.log(`Status: ${res.status} ${res.statusText} (${duration}ms)`);
    
    // Check all headers related to ratelimit, retry, quota
    const relevantHeaders = {};
    for (const [k, v] of res.headers.entries()) {
      if (k.toLowerCase().includes('rate') || k.toLowerCase().includes('limit') || k.toLowerCase().includes('retry') || k.toLowerCase().includes('quota') || k.toLowerCase().includes('usage')) {
        relevantHeaders[k] = v;
      }
    }
    console.log('Rate Limit / Quota Headers:', JSON.stringify(relevantHeaders, null, 2));

    const text = await res.text();
    try {
      const json = JSON.parse(text);
      if (json.usage) {
        console.log('Usage Data returned in body:', json.usage);
      } else {
        console.log('No usage object in body.');
      }
      if (json.error) {
        console.log('API Error:', json.error);
      }
    } catch {
      console.log('Body is not JSON:', text.slice(0, 200));
    }
  } catch (err) {
    console.error(`Fetch failed for ${name}:`, err.message);
  }
}

async function testOpenRouterAuth(key) {
  console.log('\n=== Testing OpenRouter /auth/key endpoint ===');
  try {
    const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: { 'Authorization': `Bearer ${key}` }
    });
    console.log('OpenRouter Auth Status:', res.status);
    const data = await res.json();
    console.log('OpenRouter Auth Data:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('OpenRouter Auth error:', e.message);
  }
}

async function run() {
  // 1. Groq
  if (process.env.GROQ_API_KEY) {
    await testProvider('Groq', 'https://api.groq.com/openai/v1/chat/completions', process.env.GROQ_API_KEY, 'llama-3.1-8b-instant');
  }

  // 2. Cerebras
  if (process.env.CEREBRAS_API_KEY) {
    await testProvider('Cerebras', 'https://api.cerebras.ai/v1/chat/completions', process.env.CEREBRAS_API_KEY, 'gpt-oss-120b');
  }

  // 3. Gemini OpenAI endpoint
  if (process.env.GEMINI_API_KEY) {
    await testProvider('Gemini (OpenAI compat)', 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', process.env.GEMINI_API_KEY, 'gemini-2.5-flash');
  }

  // 4. Mistral
  if (process.env.MISTRAL_API_KEY) {
    await testProvider('Mistral', 'https://api.mistral.ai/v1/chat/completions', process.env.MISTRAL_API_KEY, 'mistral-small-latest');
  }

  // 5. OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    await testOpenRouterAuth(process.env.OPENROUTER_API_KEY);
    await testProvider('OpenRouter', 'https://openrouter.ai/api/v1/chat/completions', process.env.OPENROUTER_API_KEY, 'openrouter/free', {
      'HTTP-Referer': 'https://samer-portfolio.vercel.app',
      'X-Title': 'Samer Portfolio'
    });
  }

  // 6. HuggingFace Router
  if (process.env.HF_TOKEN) {
    await testProvider('HuggingFace Router', 'https://router.huggingface.co/v1/chat/completions', process.env.HF_TOKEN, 'meta-llama/Llama-3.3-70B-Instruct:groq');
  }
}

run();
