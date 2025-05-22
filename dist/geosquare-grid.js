// filepath: geosquare-grid-js/geosquare-grid-js/dist/geosquare-grid.js
import { fromLonLat, toLonLat, getBounds, polyfill } from './src/core.js';
import { validateCoordinates, validateGID } from './src/utils/validation.js';
import { calculateIntersection, calculateBounds } from './src/utils/geometry.js';

const GeosquareGrid = {
    fromLonLat,
    toLonLat,
    getBounds,
    polyfill,
    validateCoordinates,
    validateGID,
    calculateIntersection,
    calculateBounds
};

export default GeosquareGrid;