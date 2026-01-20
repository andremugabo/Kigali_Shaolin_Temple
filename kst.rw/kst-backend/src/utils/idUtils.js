/**
 * Encodes a UUID string to a shorter, URL-safe Base64 string.
 * @param {string} uuid - The standard UUID string (with dashes).
 * @returns {string} - The encoded Base64URL string.
 */
const encodeUUID = (uuid) => {
    if (!uuid) return null;
    try {
        const hex = uuid.replace(/-/g, '');
        const buffer = Buffer.from(hex, 'hex');
        // Convert to Base64 and make URL safe
        return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    } catch (error) {
        console.error('Error encoding UUID:', error);
        return uuid; // Return original if failure
    }
};

/**
 * Decodes a Base64URL string back to a standard UUID string.
 * @param {string} encodedId - The encoded Base64URL string.
 * @returns {string} - The standard UUID string.
 */
const decodeUUID = (encodedId) => {
    if (!encodedId) return null;
    // If it looks like a standard UUID, return it as is
    if (encodedId.length === 36 && encodedId.includes('-')) return encodedId;

    try {
        // Restore Base64 padding and chars
        let base64 = encodedId.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        if (pad) {
            base64 += new Array(5 - pad).join('=');
        }

        const buffer = Buffer.from(base64, 'base64');
        const hex = buffer.toString('hex');

        // Re-insert dashes for standard UUID format: 8-4-4-4-12
        return [
            hex.substring(0, 8),
            hex.substring(8, 12),
            hex.substring(12, 16),
            hex.substring(16, 20),
            hex.substring(20)
        ].join('-');
    } catch (error) {
        console.error('Error decoding UUID:', error);
        return encodedId; // Return original if failure (might be invalid or already decoded)
    }
};

module.exports = {
    encodeUUID,
    decodeUUID
};
