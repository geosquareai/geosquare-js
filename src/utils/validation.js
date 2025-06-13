export const validateLongitude = (longitude) => {
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        throw new Error('Longitude must be a number between -180 and 180.');
    }
};

export const validateLatitude = (latitude) => {
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        throw new Error('Latitude must be a number between -90 and 90.');
    }
};

export const validateLevel = (level) => {
    if (typeof level !== 'number' || level < 1 || level > 15) {
        throw new Error('Level must be an integer between 1 and 15.');
    }
};

export const validateCoordinates = (longitude, latitude) => {
    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
        throw new Error("Coordinates must be numbers");
    }
    validateLongitude(longitude);
    validateLatitude(latitude);
};
export const validateGID = (gid) => {
    if (typeof gid !== 'string') {
        throw new Error("GID must be a string");
    }
    if (!/^[2-9C-EF-GH-JL-MN-PQ-RT-VWXY]+$/.test(gid)) {
        throw new Error("GID contains invalid characters");
    }
    if (gid.length < 1 || gid.length > 15) {
        throw new Error("GID length must be between 1 and 15 characters");
    }
};