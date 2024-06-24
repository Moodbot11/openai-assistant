const axios = require('axios');
const FormData = require('form-data');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).send('Text query parameter is required');
  }

  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    // OpenAI Chat API call
    const chatResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: text }]
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const chatMessage = chatResponse.data.choices[0].message.content;

    // OpenAI Text-to-Speech API call
    const form = new FormData();
    form.append('model', 'tts-1');
    form.append('voice', 'alloy');
    form.append('input', chatMessage);

    const speechResponse = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      form,
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          ...form.getHeaders()
        },
        responseType: 'arraybuffer'
      }
    );

    const audioBuffer = speechResponse.data;
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).send('An error occurred');
  }
};
