const express = require('express');
const multer = require('multer');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const OpenAI = require("openai");
const fs = require('fs').promises; // Import the File System module
const cors = require('cors');

require("dotenv").config()

const keyFilename = './vision-ai.json';

const app = express();
const PORT = 3002;

const corsOptions = {
  origin: ['http://localhost:3000', 'https://foodcheck-ai.vercel.app', 'https://foodcheck-ai.netlify.app', 'https://foodcheck-ai-bayurzx-dev.apps.sandbox-m3.1530.p1.openshiftapps.com'],
  methods: 'POST', // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

app.use(cors(corsOptions));

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Google Cloud Vision client
const client = new ImageAnnotatorClient({ keyFilename });

// Endpoint to handle image_file upload
app.post('/upload', upload.single('image_file'), async (req, res) => {
  let filePath; // Declare filePath variable outside the try block

  try {
    const jsonData = req.body.json_data;
    console.log('Received JSON Data:', jsonData);
    console.log('Received typeof JSON Data:', typeof jsonData);


    // Path to the uploaded image_file
    filePath = req.file.path;

    // Read the image_file file and send a request to Google Cloud Vision API
    const [result] = await client.textDetection(filePath);
    const detections = result.textAnnotations;

    // Extracted text from the image_file
    const extractedText = detections[0].description;

    const gptResponse = await gptText(extractedText, jsonData)

    // Respond with the extracted text
    res.json({ text: gptResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    // Delete the uploaded file regardless of success or failure
    if (filePath) {
      await deleteUploadedFile(filePath);
    }
  }
});

app.get('/', (req, res) => {
  res.status(200).json(`Welcome 🚀🚀🎉🎇.`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const deleteUploadedFile = async (filePath) => {
  try {
    await fs.unlink(filePath); // Delete the file
    console.log(`File: ${filePath} deleted successfully`);
  } catch (err) {
    console.error('Error deleting file:', err);
  }
};





async function gptText(consumables, health_data) {
  const openai = new OpenAI();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful nutrition expert designed to output JSON. You only return with any or all of this: warnings, advice, suggestions, recommendations and food_facts as keys",
      },
      {
        role: "user",
        content: `Write warnings, advice, suggestions , recommendations and/or food_facts for the patient about the content of the consumables: ${consumables} ### based on this health data: ${health_data}`
      },
    ],
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
  });
  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}


