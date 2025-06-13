/**
 * Geosquare Grid library
 * Main entry point
 */

import GeosquareGrid from './core';
import {
  fromLonLat,
  lonlatToGID,
  GIDToLonlat,
  getBounds,
  polyfill,
  getGeometry
} from './utils/helpers';


// Export all functions and the class
export {
  fromLonLat,
  getBounds,
  polyfill,
  lonlatToGID,
  GIDToLonlat,
  getGeometry

};

// Also export the GeosquareGrid as default
export default GeosquareGrid;