require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinataSDK = require('@pinata/sdk');
const { encryptFile, lockKeyForDoctor } = require('./cryptoUtils');

const app = express();

// --- Configuration ---
// 1. Initialize Pinata with your secret keys from .env
const pinata = new pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_API_SECRET
);

// 2. Set the Port (Fallback to 3001 if .env is missing it)
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(helmet()); // Adds security headers to protect your API
app.use(cors());   // Allows your Frontend to talk to this Backend
app.use(express.json({ limit: '50mb' })); // Increases limit for medical images/PDFs

// --- Routes ---

// The main endpoint your Frontend will call
app.post('/api/upload-medical-record', async (req, res) => {
    try {
        const { fileBase64, doctorPublicKey, fileName } = req.body;

        if (!fileBase64 || !doctorPublicKey) {
            return res.status(400).json({ error: "Missing file data or doctor key" });
        }

        console.log(`Processing record: ${fileName}...`);

        // 1. Encrypt the file locally (AES-256-GCM)
        const fileBuffer = Buffer.from(fileBase64, 'base64');
        const { encryptedBlob, key, iv, tag } = encryptFile(fileBuffer);

        // 2. Upload the ENCRYPTED blob to IPFS via Pinata
        const uploadResult = await pinata.pinFileToIPFS(encryptedBlob, {
            pinataMetadata: {
                name: `VAULT_${Date.now()}_${fileName}`,
                keyvalues: { status: 'encrypted' }
            }
        });

        // 3. Use ECIES to lock the symmetric key with the Doctor's Public Key
        // This ensures ONLY that specific doctor can unlock it later
        const lockedKey = await lockKeyForDoctor(doctorPublicKey, key);

        // 4. Send the 'Decentralized Receipt' back to the Frontend
        res.json({
            success: true,
            ipfsHash: uploadResult.IpfsHash,
            encryptedKey: lockedKey,
            iv: iv,
            tag: tag
        });

    } catch (error) {
        console.error("Vault Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to secure and upload medical record"
        });
    }
});

// Health check route
app.get('/', (req, res) => {
    res.send('Decentralized Medical Vault API is active.');
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`✅ Backend running on port ${PORT}`);
    console.log(`📂 Medical Vault is ready for requests`);
    console.log(`-----------------------------------------`);
});