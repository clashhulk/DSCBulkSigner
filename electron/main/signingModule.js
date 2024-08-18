const fs = require("fs");
const { sign } = require("node-signpdf");
const { pki } = require("node-forge");

/**
 * This function signs a PDF file using the specified certificate and private key.
 *
 * @param {string} pdfPath - The path to the PDF file to be signed.
 * @param {string} certificatePath - The path to the certificate file.
 * @param {string} privateKeyPath - The path to the private key file.
 * @param {Object} position - The position where the signature should appear.
 * @param {number} pageNumber - The page number where the signature should appear.
 * @return {Promise<Buffer>} - A promise that resolves to the signed PDF buffer.
 */
const signPDFDocument = async (
  pdfPath,
  certificatePath,
  privateKeyPath,
  position,
  pageNumber
) => {
  console.log(
    "Signing PDF at:",
    pdfPath,
    " with certificate:",
    certificatePath
  );
  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const cert = fs.readFileSync(certificatePath);
    const key = fs.readFileSync(privateKeyPath);

    // Load certificate and private key
    const certificate = pki.certificateFromPem(cert);
    const privateKey = pki.privateKeyFromPem(key);

    // Create a signature
    const signer = sign({
      p12Buffer: Buffer.concat([certificate, privateKey]),
      passphrase: "", // Provide the passphrase if your private key is encrypted
    });

    // Options for the signature appearance
    const options = {
      // Add any specific options needed for the appearance and location of the signature
    };

    // Sign the PDF
    const signedPdf = signer.sign(pdfBuffer, options);
    return signedPdf;
  } catch (error) {
    console.error("Failed to sign PDF:", error);
    throw error;
  }
};

module.exports = {
  signPDFDocument,
};
