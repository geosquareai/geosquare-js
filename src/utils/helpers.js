import GeosquareGrid from '../core';
import { validateCoordinates, validateGID as validateGid } from './validation';

/**
 * Convert longitude and latitude to grid ID at specified level
 * @param {number} longitude - Longitude in decimal degrees
 * @param {number} latitude - Latitude in decimal degrees
 * @param {number} level - Precision level (1-15)
 * @returns {string} Grid identifier
 */
function lonlatToGID(longitude, latitude, level) {
  const grid = new GeosquareGrid();
  return grid.lonlatToGID(longitude, latitude, level);
}

/**
 * Initialize grid properties from longitude, latitude, and level
 * @param {number} longitude - Longitude in decimal degrees
 * @param {number} latitude - Latitude in decimal degrees
 * @param {number} level - Precision level (1-15)
 * @returns {GeosquareGrid} A GeosquareGrid instance
 */
function fromLonLat(longitude, latitude, level) {
  const grid = new GeosquareGrid();
  grid.fromLonlat(longitude, latitude, level);
  return grid;
}

/**
 * Convert grid ID to longitude and latitude
 * @param {string} gid - Grid identifier
 * @returns {Array<number>} [longitude, latitude]
 */
function GIDToLonlat(gid) {
  const grid = new GeosquareGrid();
  return grid.gidToLonlat(gid);
}

/**
 * Initialize grid properties from a grid ID
 * @param {string} gid - Grid identifier
 * @returns {GeosquareGrid} A GeosquareGrid instance
 */
function fromGid(gid) {
  const grid = new GeosquareGrid();
  grid.fromGid(gid);
  return grid;
}

/**
 * Get the bounding box for a grid ID
 * @param {string} gid - Grid identifier
 * @returns {Array<number>} Bounding box [minLongitude, minLatitude, maxLongitude, maxLatitude]
 */
function getBounds(gid) {
  const grid = new GeosquareGrid();
  return grid.gidToBound(gid);
}

/**
 * Find all grid cells that intersect with a given polygon
 * @param {import('@turf/turf').Feature<import('@turf/turf').Polygon | import('@turf/turf').MultiPolygon, import('@turf/turf').Properties>} polygon - GeoJSON polygon object
 * @param {number|Array<number>} size - Size level or range [min, max]
 * @param {string} start - Starting cell identifier
 * @param {boolean} fullcover - Whether to include only fully contained cells
 * @returns {Array<string>} List of grid identifiers that intersect with the polygon
 */
function polyfill(polygon, size, start = "2", fullcover = true) {
  const grid = new GeosquareGrid();
  return grid.polyfill(polygon, size, start, fullcover);
}

/**
 * Calculate geometry for a grid ID
 * @param {string} gid - Grid identifier
 * @returns {Object} GeoJSON polygon geometry representing the grid cell
 */
function calculateGeometry(gid) {
  const grid = new GeosquareGrid();
  return grid.gidToGeometry(gid);
}

/**
 * Get the geometry for a grid ID
 * @param {string} gid - Grid identifier
 * @returns {Object} GeoJSON polygon geometry representing the grid cell
 */
function getGeometry(gid) {
  const grid = new GeosquareGrid();
  return grid.gidToGeometry(gid);
}

export {
  fromLonLat,
  lonlatToGID,
  GIDToLonlat,
  getBounds,
  polyfill,
  validateCoordinates,
  validateGid,
  calculateGeometry,
  getGeometry
};
