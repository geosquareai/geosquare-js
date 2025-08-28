# Geosquare Grid

A JavaScript library for converting between geographic coordinates and grid identifiers (GIDs) using Turf.js for geospatial operations.

## Installation

```bash
npm install geosquare
```

## Basic Usage

### Importing the library

```javascript
// ES Modules
import { GeosquareGrid } from 'geosquare';

// CommonJS
const { GeosquareGrid } = require('geosquare');
```

### Converting coordinates to GID

```javascript
const grid = new GeosquareGrid();
const gid = grid.lonlatToGID(106.8938, -6.2608, 5);
console.log(`GID: ${gid}`);
```

### Converting GID to coordinates

```javascript
const grid = new GeosquareGrid();
grid.fromGid('J3P7V8Y247G3');
const [longitude, latitude] = grid.getLonlat();
console.log(`Coordinates: ${longitude}, ${latitude}`);
```

### Getting grid cell boundaries

```javascript
const grid = new GeosquareGrid();
grid.fromGid('J3P7V8Y247G3');
const bounds = grid.getBound();
// bounds = [minLongitude, minLatitude, maxLongitude, maxLatitude]
console.log(`Bounds: ${JSON.stringify(bounds)}`);
```

### Getting grid cell geometry (GeoJSON)

```javascript
const grid = new GeosquareGrid();
grid.fromGid('J3P7V8Y247G3');
const geometry = grid.getGeometry();
// Can be used with mapping libraries like Leaflet, Mapbox, etc.
```

## Advanced Usage

### Finding child cells at a specific resolution

```javascript
const grid = new GeosquareGrid();
const parentGid = 'J3P7';
const childSize = 1000; // Resolution level 9
const children = grid.parrentToAllchildren(parentGid, childSize);
console.log(`Found ${children.length} children`);
```

### Finding cells that intersect with a polygon (polyfill)

```javascript
const grid = new GeosquareGrid();
// Create a test polygon from an existing cell
const testGid = 'J3N2M7';
const testGeometry = grid.gidToGeometry(testGid);

// Find cells at resolution level 10 (size 500)
const intersectingCells = grid.polyfill(testGeometry, 500);
console.log(`Found ${intersectingCells.length} intersecting cells`);
```

### Understanding precision levels

Grid precision increases with each level:

```javascript
const grid = new GeosquareGrid();
const sampleLon = 117.10299;
const sampleLat = -0.48765;

for (let level = 1; level <= 5; level++) {
  const levelGid = grid.lonlatToGID(sampleLon, sampleLat, level);
  console.log(`Level ${level} GID: ${levelGid}`);
  
  grid.fromGid(levelGid);
  const levelBounds = grid.getBound();
  const width = levelBounds[2] - levelBounds[0];
  const height = levelBounds[3] - levelBounds[1];
  console.log(`  Bounds size: ${width.toFixed(6)}° × ${height.toFixed(6)}°`);
}
```

## Grid Cell Resolution Reference

| Size (meter) | Level | Approximate Cell Dimensions |
|----------|-------|----------------------------|
| 10000000 | 1     | Country-sized              |
| 1000000  | 3     | Large region               |
| 100000   | 5     | City-sized                 |
| 10000    | 7     | Neighborhood               |
| 1000     | 9     | Block-sized                |
| 100      | 11    | Building complex           |
| 10       | 13    | Building                   |
| 5        | 14    | Room-sized                 |

## API Reference

### GeosquareGrid Class

#### Constructor
- `new GeosquareGrid()` - Creates a new GeosquareGrid instance

#### Methods
- `lonlatToGID(longitude, latitude, level)` - Converts coordinates to GID
- `gidToLonlat(gid)` - Converts GID to coordinates
- `gidToBound(gid)` - Gets the bounding box for a GID
- `gidToGeometry(gid)` - Gets the GeoJSON polygon for a GID
- `fromLonlat(longitude, latitude, level)` - Initializes grid from coordinates
- `fromGid(gid)` - Initializes grid from GID
- `getGid()` - Gets the current GID
- `getLonlat()` - Gets the current coordinates
- `getBound()` - Gets the current bounds
- `getGeometry()` - Gets the current geometry
- `parrentToAllchildren(key, size, geometry)` - Gets all child cells at a specific resolution
- `polyfill(polygon, size, start, fullcover)` - Finds cells that intersect with a polygon

## License

 GPL-3.0 license
