# Geosquare Grid

A JavaScript library for converting between geographic coordinates and grid identifiers (GIDs) using Turf.js for geospatial operations.

## Installation

```bash
npm install geosquare-grid
```

## Usage

```javascript
// ES Modules
import GeosquareGrid, { fromLonLat, lonlatToGID } from 'geosquare-grid';

// Convert coordinates to GID
const gid = lonlatToGID(longitude, latitude, level);

// Create a grid instance from coordinates
const grid = fromLonLat(longitude, latitude, level);

// Or directly using the class
const grid = new GeosquareGrid();
grid.fromLonlat(longitude, latitude, level);
```

## API Documentation

### Core Functions

- `lonlatToGID(longitude, latitude, level)`: Convert coordinates to GID
- `GIDToLonlat(gid)`: Convert GID to coordinates
- `getBounds(gid)`: Get the bounding box for a GID
- `polyfill(polygon, size, start, fullcover)`: Get grid cells that intersect with a polygon
- `getGeometry(gid)`: Get the GeoJSON geometry for a GID

### GeosquareGrid Class

The main class providing all grid functionality.

## License

Apache-2.0