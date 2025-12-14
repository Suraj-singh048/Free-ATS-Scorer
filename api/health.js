export default function handler(req, res) {
  try {
    console.log('[Health Check] Endpoint called');
    console.log('[Health Check] Method:', req.method);
    console.log('[Health Check] API Key present:', !!process.env.GEMINI_API_KEY);

    res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      ai_enabled: !!process.env.GEMINI_API_KEY,
      ai_provider: 'Google Gemini 2.5 Flash',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Health Check] Error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
