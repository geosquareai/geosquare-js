// filepath: geosquare-grid-js/geosquare-grid-js/src/utils/validation.js

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

export const validateGID = (gid) => {
    if (typeof gid !== 'string' || gid.length < 1) {
        throw new Error('GID must be a non-empty string.');
    }
};