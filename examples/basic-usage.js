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

// Additional examples
console.log('\n--- Additional Examples ---\n');

// Example 1: Initialize from a specific GID and get coordinates
console.log('Example 1: Initialize from GID and get coordinates');
grid.fromGid('J3P7V8Y247G3');
const coords = grid.getLonlat();
console.log(`Coordinates: ${coords[0]}, ${coords[1]}`);

// Example 2: Get polygon geometry for visualization
console.log('\nExample 2: Get polygon geometry for GID');
const geometry = grid.getGeometry();
console.log(`Geometry: ${JSON.stringify(geometry)}`);

// Example 3: Finding all child cells at a specific resolution
console.log('\nExample 3: Finding all child cells at a specific resolution');
const parentGid = 'J3P7';
const childSize = 1000; // Resolution level 9
console.log(`Finding all children of ${parentGid} at size ${childSize}`);
const children = grid.parrentToAllchildren(parentGid, childSize);
console.log(`Found ${children.length} children`);
console.log(`First 5 children: ${children.slice(0, 5).join(', ')}`);

// Example 4: Finding cells that intersect with a polygon (polyfill)
console.log('\nExample 4: Finding cells that intersect with a polygon');
// Create a test polygon
const testGid = 'J3N2M7';
const testGeometry = grid.gidToGeometry(testGid);
console.log(`Using geometry from GID: ${testGid}`);

// Find cells at resolution level 10
const intersectingCells = grid.polyfill(testGeometry, 500);
console.log(`Found ${intersectingCells.length} intersecting cells at resolution 500`);
console.log(`First 5 intersecting cells: ${intersectingCells.slice(0, 5).join(', ')}`);

// Example 5: Converting coordinates at different precision levels
console.log('\nExample 5: Converting coordinates at different precision levels');
const sampleLon = 117.10299251796522;
const sampleLat = -0.4876505561838957;
console.log(`Sample coordinates: ${sampleLon}, ${sampleLat}`);

for (let level = 1; level <= 5; level++) {
  const levelGid = grid.lonlatToGID(sampleLon, sampleLat, level);
  console.log(`Level ${level} GID: ${levelGid}`);
  
  // Get the bounds to show how precision changes with level
  grid.fromGid(levelGid);
  const levelBounds = grid.getBound();
  console.log(`  Bounds size: ${(levelBounds[2] - levelBounds[0]).toFixed(6)}° × ${(levelBounds[3] - levelBounds[1]).toFixed(6)}°`);
}