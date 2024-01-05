const express = require('express');
const multer = require('multer');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const keyFilename = './vision-ai.json';


const app = express();
const PORT = 3000;

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Google Cloud Vision client
const client = new ImageAnnotatorClient({ keyFilename });

// Endpoint to handle image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Path to the uploaded image
    const filePath = req.file.path;

    // Read the image file and send a request to Google Cloud Vision API
    const [result] = await client.textDetection(filePath);
    const detections = result.textAnnotations;

    // Extracted text from the image
    const extractedText = detections[0].description;

    // Respond with the extracted text
    res.json({ text: extractedText });
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
