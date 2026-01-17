import axios from 'axios';

/**
 * Converts a browser File object to a Base64 string
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove the "data:image/png;base64," prefix for the backend
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Sends the medical record to your Node.js vault
 */
export const secureAndUploadRecord = async (file, doctorPubKey) => {
    try {
        const base64File = await fileToBase64(file);

        const response = await axios.post('http://localhost:3001/api/upload-medical-record', {
            fileBase64: base64File,
            doctorPublicKey: doctorPubKey,
            fileName: file.name
        });

        return response.data; // This contains the ipfsHash and lockedKey
    } catch (error) {
        console.error("Error connecting to the vault server:", error);
        throw error;
    }
};