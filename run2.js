const sharp = require('sharp');

// Input and output file paths
const inputFile = 'input2.jfif';
const outputFile = `output_${Date.now().toString()}.${inputFile.split(".")[1]}`

// Read input image metadata (width and height)
sharp(inputFile)
  .metadata()
  .then(metadata => {
    // Calculate the target width (maximum width: 800px)
    const targetWidth = Math.min(metadata.width, 800);

    // Compress the image with specified settings
    sharp(inputFile)
      .resize(targetWidth) // Resize to maximum width of 800px
      .jpeg({ quality: 70 }) // Set JPEG compression quality
      .toFile(outputFile)
      .then(() => console.log('Image compression completed successfully'))
      .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
