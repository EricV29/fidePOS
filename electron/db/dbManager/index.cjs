const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

/*
 Usage:
  node index.cjs encrypt <file> 'password' 'salt'
  node index.cjs decrypt <file> 'password' 'salt'
*/

// --- CONFIGURATION ---
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

// Read terminal arguments:
// [2] mode (encrypt/decrypt), [3] filename, [4] password, [5] salt
const [, , mode, file, password, salt] = process.argv;

// Validate required arguments
if (!mode || !file || !password || !salt) {
  console.log(`
  ❌ Missing arguments!
  Usage:
  node index.cjs encrypt <file> <password> <salt>
  `);
  process.exit(1);
}

// Generate the encryption key using scryptSync (must match your Electron app logic)
const KEY = crypto.scryptSync(password, salt, 32);

const inputPath = path.join(__dirname, file);
const outputPath = path.join(
  __dirname,
  (mode === "encrypt" ? "encrypted_" : "decrypted_") + file,
);

if (mode === "encrypt") {
  try {
    // Generate a random Initialization Vector (IV)
    const iv = crypto.randomBytes(IV_LENGTH);
    const buffer = fs.readFileSync(inputPath);

    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    // Construct the final buffer: [IV (16 bytes) + Encrypted Data]
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);

    fs.writeFileSync(outputPath, result);
    console.log(`✅ File ENCRYPTED successfully: ${outputPath}`);
  } catch (e) {
    console.error("❌ Encryption failed:", e.message);
  }
} else if (mode === "decrypt") {
  try {
    const buffer = fs.readFileSync(inputPath);

    // Extract the IV from the first 16 bytes of the file
    const iv = buffer.slice(0, IV_LENGTH);
    const encryptedData = buffer.slice(IV_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

    // Decrypt the data and remove padding
    const result = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    fs.writeFileSync(outputPath, result);
    console.log(`✅ File DECRYPTED successfully: ${outputPath}`);
  } catch (e) {
    console.error(
      "❌ Decryption failed: Check your password, salt, or if the file is corrupted.",
    );
  }
} else {
  console.log("❌ Invalid mode. Use 'encrypt' or 'decrypt'.");
}
