export const encodeId = (id) => {
    try {
        return btoa(id.toString());
    } catch (error) {
        console.error('Error encoding ID:', error);
        return id.toString();
    }
};


export const decodeId = (encodedId) => {
    try {
        return atob(encodedId);
    } catch (error) {
        console.error('Error decoding ID:', error);
        // If decoding fails, assume it's already plain
        return encodedId;
    }
};


export const isBase64 = (str) => {
    try {
        return btoa(atob(str)) === str;
    } catch (error) {
        return false;
    }
};


export const safeDecodeId = (id) => {
    if (!id) return null;
    
    if (isBase64(id)) {
        return decodeId(id);
    }
    
    return id;
};