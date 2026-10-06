// Vercel serverless function: POST /api/chat
// Runs on the server only. This is where GROQ_API_KEY is read and where the knowledge base is used.
// The Groq call, validation and rate limiting are built in the next phase (see chatbot/README.md); until then it answers 501.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  return res.status(501).json({ error: 'not_implemented', message: 'The chat backend is not enabled yet.' });
}
