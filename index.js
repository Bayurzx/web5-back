const express = require('express');
const multer = require('multer');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const OpenAI = require("openai");
require("dotenv").config()

const keyFilename = './vision-ai.json';

const app = express();
const PORT = 3002;

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Google Cloud Vision client
const client = new ImageAnnotatorClient({ keyFilename });

// Endpoint to handle image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const jsonData = req.body.json_data;
    console.log('Received JSON Data:', jsonData);
    console.log('Received typeof JSON Data:', typeof jsonData);


    // Path to the uploaded image
    const filePath = req.file.path;

    // Read the image file and send a request to Google Cloud Vision API
    const [result] = await client.textDetection(filePath);
    const detections = result.textAnnotations;

    // Extracted text from the image
    const extractedText = detections[0].description;

    const gptResponse = await gptText(extractedText, jsonData)

    // Respond with the extracted text
    res.json({ text: gptResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/', (req, res) => {
  res.status(200).json(`Welcome 🚀🚀🎉🎇.`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});






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


