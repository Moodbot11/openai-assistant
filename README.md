# openai-assistant
Open AI script no api to a voice interaction chat but GTP 40
et's consolidate everything into a single project using the latest code with OpenAI APIs for the assistant and text-to-speech/speech-to-text functionalities. Here's the complete setup:

Step-by-Step Setup
Step 1: Create a GitHub Repository
Create a new GitHub repository:
Go to GitHub and create a new repository.
Name your repository (e.g., openai-assistant).
Initialize the repository with a README file.
Step 2: Add Necessary Files on GitHub
Create package.json:

On GitHub, navigate to your repository.
Click on "Add file" > "Create new file".
Name the file package.json and add the following content:
json
Copy code
{
  "name": "openai-assistant",
  "version": "1.0.0",
  "description": "An assistant using OpenAI APIs",
  "main": "api/index.js",
  "dependencies": {
    "axios": "^0.27.2",
    "dotenv": "^10.0.0",
    "form-data": "^4.0.0"
  }
}
Commit the new file.
Create .gitignore:

Click on "Add file" > "Create new file".
Name the file .gitignore and add the following content:
plaintext
Copy code
node_modules/
.env
Commit the new file.
Create api/index.js:

Click on "Add file" > "Create new file".
Name the file api/index.js and add the following content:
javascript
Copy code
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
Commit the new file.
Create vercel.json:

Click on "Add file" > "Create new file".
Name the file vercel.json and add the following content:
json
Copy code
{
  "version": 2,
  "builds": [
    {
      "src": "api/*.js",
      "use": "@vercel/node"
    }
  ]
}
Commit the new file.
Step 3: Set Up Environment Variables on Vercel
Login to Vercel and create a new project by importing your GitHub repository.
Configure environment variables:
Go to your project dashboard on Vercel.
Navigate to the "Settings" tab.
Click on "Environment Variables" and add the OPENAI_API_KEY environment variable with the corresponding value.
Step 4: Deploy to Vercel
Deploy the project:
Vercel will automatically deploy the project after you import the repository.
Any subsequent commits to the GitHub repository will trigger a redeployment.
With this setup, you now have a project that directly handles the OpenAI API calls and is deployed via Vercel. You can manage everything through GitHub’s web interface, ensuring a seamless workflow from development to deployment without handling files locally.






