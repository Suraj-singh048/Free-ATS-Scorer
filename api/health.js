export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    ai_enabled: !!process.env.GEMINI_API_KEY,
    ai_provider: 'Google Gemini 2.5 Flash'
  });
}
