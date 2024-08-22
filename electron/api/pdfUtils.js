const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib'); // Install pdf-lib via npm

async function addSignatureToPdf(sourcePath, destinationPath, signatureText) {
  try {
    const files = fs.readdirSync(sourcePath).filter(file => file.endsWith('.pdf'));
    
    for (const file of files) {
      const sourceFile = path.join(sourcePath, file);
      const destFile = path.join(destinationPath, file);
      
      // Load the PDF
      const pdfDoc = await PDFDocument.load(fs.readFileSync(sourceFile));
      const pages = pdfDoc.getPages();
      
      // Add signature text to each page
      pages.forEach(page => {
        page.drawText(signatureText, {
          x: page.getWidth() - 100, // Position the text
          y: 20, // Position the text
          size: 30,
          color: rgb(0, 0, 0), // Black color
        });
      });
      
      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(destFile, pdfBytes);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = {
  addSignatureToPdf,
  // Other functions if any
};
