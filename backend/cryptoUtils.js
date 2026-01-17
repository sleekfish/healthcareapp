const crypto = require('crypto');
const EthCrypto = require('eth-crypto');

// This function turns a normal medical file into "gibberish"
const encryptFile = (fileBuffer) => {
    const symmetricKey = crypto.randomBytes(32); // The "Temporary Key"
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', symmetricKey, iv);

    const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
    const tag = cipher.getAuthTag();

    return {
        encryptedBlob: encrypted,
        key: symmetricKey.toString('hex'),
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
    };
};

// This function "locks" the Temporary Key using the DOCTOR'S Public Key
const lockKeyForDoctor = async (doctorPublicKey, symmetricKey) => {
    const encryptedKey = await EthCrypto.encryptWithPublicKey(
        doctorPublicKey,
        symmetricKey
    );
    return EthCrypto.cipher.stringify(encryptedKey);
};

module.exports = { encryptFile, lockKeyForDoctor };