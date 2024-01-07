const sharp = require('sharp');

// Input and output file paths
const inputFile = 'sharp.jpg';
const outputFile = 'output_compressed.jpg';

// Set the quality (0-100) for JPEG compression
const quality = 80; // Adjust the quality as needed

// Compress the image with specified quality
sharp(inputFile)
  .jpeg({ quality })
  .toFile(outputFile)
  .then(() => console.log('Image compressed successfully'))
  .catch(err => console.error(err));
