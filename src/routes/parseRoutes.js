const express = require('express');
const fetch = require('node-fetch').default;
const pdfParse = require('pdf-parse');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

async function extractTextFromPdfBase64(fileBase64) {
  const pdfBuffer = Buffer.from(fileBase64, 'base64');
  const data = await pdfParse(pdfBuffer);
  return data?.text?.trim() || '';
}

router.post('/lr', async (req, res) => {
  const { fileName, fileType, fileBase64, provider = 'nemo' } = req.body;
  if (!fileName || !fileType || !fileBase64) {
    return res.status(400).json({ error: 'fileName, fileType and fileBase64 are required' });
  }

  const apiKey = provider === 'nemo'
    ? process.env.NEMO_ULTRA_API_KEY
    : process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: `Missing API key for provider: ${provider}` });
  }

  const providerUrl = provider === 'nemo'
    ? process.env.NEMO_ULTRA_API_URL || 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.anthropic.com/v1/messages';

  const nemoModel = process.env.NEMO_ULTRA_MODEL || '~openai/gpt-latest';
  const promptText = `Extract data from this Lorry Receipt / LR Bill / transport invoice.\nReturn ONLY a valid JSON object with these exact keys (use null if not found):\n{\n  "transporterName": "",\n  "transporterGSTIN": "",\n  "transporterSACCode": "",\n  "bookingNumber": "",\n  "bookingDate": "YYYY-MM-DD",\n  "origin": "",\n  "destination": "",\n  "descriptionOfGoods": "",\n  "numberOfParcels": 0,\n  "weightKgs": 0,\n  "freightCharges": 0,\n  "otherCharges": 0,\n  "sgst": 0,\n  "cgst": 0,\n  "invoiceValue": 0,\n  "modeOfPayment": "TO PAY or PAID or TBB",\n  "remarks": ""\n}\nNo explanation. No markdown. Pure JSON only.\n\nThe uploaded file is base64-encoded ${fileType === 'application/pdf' ? 'PDF' : 'image'} data below.\n${fileBase64}`;

  const fileDataUrl = `data:${fileType};base64,${fileBase64}`;
  const bodyPayload = provider === 'nemo'
    ? {
      model: nemoModel,
      max_tokens: 1000,
      temperature: 0,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: promptText },
          { type: 'file', file: { filename: fileName, file_data: fileDataUrl } },
        ],
      }],
      plugins: [
        { id: 'file-parser', pdf: { engine: process.env.NEMO_ULTRA_PDF_ENGINE || 'cloudflare-ai' } },
      ],
    }
    : {
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          {
            type: fileType === 'application/pdf' ? 'document' : 'image',
            source: {
              type: 'base64',
              media_type: fileType,
              data: fileBase64,
            },
          },
          {
            type: 'text',
            text: promptText,
          },
        ],
      }],
    };

  try {
    const response = await fetch(providerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(bodyPayload),
    });

    const raw = await response.text();
    if (!response.ok) {
      console.error('LR parse provider error', { provider, providerUrl, status: response.status, raw });
      return res.status(response.status).json({
        error: 'LR parse provider returned an error',
        provider,
        providerUrl,
        status: response.status,
        details: raw,
      });
    }

    let responseData;
    try {
      responseData = JSON.parse(raw);
    } catch (parseErr) {
      console.error('Failed to parse provider JSON response', { provider, providerUrl, raw });
      return res.status(502).json({ error: 'Invalid JSON from LR provider', provider, providerUrl, details: raw });
    }

    const extractedText = provider === 'nemo'
      ? responseData?.choices?.[0]?.message?.content || responseData?.choices?.[0]?.text || ''
      : responseData?.content?.find((block) => block?.type === 'text')?.text || responseData?.completion || '';

    return res.json({ provider, text: extractedText, raw: responseData });
  } catch (err) {
    console.error('LR parse proxy failed', err);
    res.status(500).json({ error: 'Failed to parse LR bill', details: err.message });
  }
});

module.exports = router;
