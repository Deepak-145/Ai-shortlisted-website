const URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM = `
You are an AI recruitment assistant.

You MUST return ONLY valid JSON.

Do NOT return markdown.
Do NOT return explanations outside JSON.
Do NOT use special symbols.
Do NOT generate random text.

Analyze candidates based on:
- Required skills
- Preferred skills
- Experience
- Bio/projects relevance

Return ONLY this JSON structure:

{
  "topCandidates": [
    {
      "id": "1",
      "name": "Rahul Sharma",
      "score": 95,
      "reason": "Strong MERN stack experience with relevant projects."
    }
  ],
  "explanation": "Rahul is the best fit candidate.",
  "bestFitId": "1"
}
`;

export async function aiShortlist({ job, candidates }) {
  const model = process.env.OPENROUTER_MODEL;

  console.log("MODEL:", model);

  const userPrompt = `
JOB REQUIREMENTS:
${JSON.stringify(job, null, 2)}

CANDIDATES:
${JSON.stringify(candidates, null, 2)}

Remember:
Return ONLY valid JSON.
`;

  const resp = await fetch(URL, {
    method: 'POST',

    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'AI Candidate Shortlisting',
    },

    body: JSON.stringify({
      model,

      temperature: 0.1,

      max_tokens: 1000,

      response_format: {
        type: 'json_object',
      },

      messages: [
        {
          role: 'system',
          content: SYSTEM,
        },

        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();

    console.error(text);

    throw Object.assign(
      new Error(`OpenRouter error ${resp.status}: ${text}`),
      { status: 502 }
    );
  }

  const data = await resp.json();

  console.log("OPENROUTER RESPONSE:", data);

  const content =
    data?.choices?.[0]?.message?.content || '{}';

  try {
    const cleaned = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      topCandidates: Array.isArray(parsed.topCandidates)
        ? parsed.topCandidates
        : [],

      explanation: parsed.explanation || '',

      bestFitId: parsed.bestFitId ?? null,
    };
  } catch (error) {
    console.error("JSON Parse Error:", error);

    return {
      topCandidates: [],
      explanation: content,
      bestFitId: null,
    };
  }
}