// filepath: geosquare-grid-js/examples/basic-usage.js
import { GeosquareGrid } from '../src/index.js';

// Initialize the GeosquareGrid object
const grid = new GeosquareGrid();

// Convert longitude and latitude to GID
const gid = grid.lonlatToGid(106.8938638928753022, -6.2608983083383016, 5);
console.log(`GID: ${gid}`);

// Convert GID back to longitude and latitude
const [longitude, latitude] = grid.gidToLonlat(gid);
console.log(`Longitude: ${longitude}, Latitude: ${latitude}`);

// Get bounds for the grid cell
const bounds = grid.getBound();
console.log(`Bounds: ${JSON.stringify(bounds)}`);