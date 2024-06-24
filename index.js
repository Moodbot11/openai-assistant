const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Chatbot assistant endpoint
app.post('/chat', async (req, res) => {
  const { userInput } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: userInput }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const assistantResponse = response.data.choices[0].message.content.trim();
    res.json({ response: assistantResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating text' });
  }
});

// Text-to-Speech endpoint
app.post('/generate-speech', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        voice: 'alloy',
        input: text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    const audioContent = response.data;
    res.set('Content-Type', 'audio/mp3');
    res.send(audioContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating speech' });
  }
});

// Speech-to-Text endpoint
app.post('/transcribe-speech', upload.single('audio'), async (req, res) => {
  const audioFile = req.file;

  if (!audioFile) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  try {
    const formData = new FormData();
    formData.append('file', audioFile.buffer, audioFile.originalname);
    formData.append('model', 'whisper-1');

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    const transcription = response.data.text;
    res.json({ transcription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error transcribing audio' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
