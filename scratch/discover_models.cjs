const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../api/.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function discover() {
  // 1. Groq models
  if (process.env.GROQ_API_KEY) {
    console.log('\n--- GROQ MODELS ---');
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
      });
      console.log('Groq models status:', res.status);
      const json = await res.json();
      if (json.data) {
        console.log('Available Groq models:', json.data.map(m => m.id));
      } else {
        console.log('Groq response:', json);
      }
    } catch (e) {
      console.log('Groq error:', e.message);
    }
  }

  // 2. Gemini models
  if (process.env.GEMINI_API_KEY) {
    console.log('\n--- GEMINI MODELS ---');
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
      console.log('Gemini status:', res.status);
      const json = await res.json();
      if (json.models) {
        console.log('Available Gemini models:', json.models.map(m => m.name.replace('models/', '')));
      } else {
        console.log('Gemini response:', json);
      }
    } catch (e) {
      console.log('Gemini error:', e.message);
    }
  }

  // 3. Cerebras models
  if (process.env.CEREBRAS_API_KEY) {
    console.log('\n--- CEREBRAS MODELS ---');
    try {
      const res = await fetch('https://api.cerebras.ai/v1/models', {
        headers: { 'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}` }
      });
      console.log('Cerebras status:', res.status);
      const json = await res.json();
      console.log('Cerebras response:', json);
    } catch (e) {
      console.log('Cerebras error:', e.message);
    }
  }
}

discover();
