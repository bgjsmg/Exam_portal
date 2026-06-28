// netlify/functions/evaluate.js
// Serverless proxy — API key stored in Netlify env var, shared across ALL users.
// Set GROQ_API_KEY in Netlify → Site Configuration → Environment Variables.

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GROQ_API_KEY not configured. Go to Netlify → Site Configuration → Environment Variables and add GROQ_API_KEY.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body.' }) };
  }

  const { question, modelAnswer, studentAnswer, maxMarks, model } = body;

  if (!question || studentAnswer === undefined || !maxMarks) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: question, studentAnswer, maxMarks.' }) };
  }

  // Use model from request, fall back to env var, then default
  const selectedModel = model || process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

  const prompt = `You are a Python programming examiner. Evaluate the student answer below.

Question: ${question}
Model Answer: ${modelAnswer || '(not provided)'}
Student Answer: ${studentAnswer || '(no answer provided)'}
Maximum Marks: ${maxMarks}

Evaluate strictly but fairly. Award marks based on correctness, completeness, and clarity.
Respond ONLY with a JSON object (no markdown, no extra text):
{"marks": <integer 0 to ${maxMarks}>, "feedback": "<brief 1-2 sentence feedback>"}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: err?.error?.message || `Groq API error (HTTP ${response.status})` })
      };
    }

    const data = await response.json();
    const raw = data.choices[0].message.content.trim();
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        marks: Math.min(maxMarks, Math.max(0, parseInt(parsed.marks))),
        feedback: parsed.feedback
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Evaluation failed: ' + err.message })
    };
  }
};
