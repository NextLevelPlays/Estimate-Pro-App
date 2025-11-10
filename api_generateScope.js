// Save this file as: /api/generateScope.js (in your project root)
// This is a Vercel Serverless Function that handles Claude API calls securely

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { rawScope } = req.body;

  // Validate input
  if (!rawScope || rawScope.trim() === '') {
    return res.status(400).json({ error: 'Raw scope is required' });
  }

  // Get API key from environment variable
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Call the Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `You are a professional handyman service scope writer. Convert the following raw job notes into a detailed, professional scope of work for a client estimate. Include specific measurements, materials, quantities, and labor details. Format it as a numbered list with clear descriptions.

Raw Job Notes:
${rawScope}

Please provide a professional scope of work that is detailed, specific, and suitable for presenting to a client.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to generate scope',
        details: errorData
      });
    }

    const data = await response.json();
    
    // Extract the text from Claude's response
    const professionalScope = data.content[0].text;

    return res.status(200).json({ 
      success: true,
      professionalScope: professionalScope
    });

  } catch (error) {
    console.error('Error calling Claude API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}
