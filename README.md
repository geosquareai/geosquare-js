# Geosquare Grid JS

Geosquare Grid JS is a JavaScript library that provides methods for converting between geographic coordinates (longitude and latitude) and grid identifiers (GIDs). It also includes functionality for spatial operations and geometry handling using Turf.js, making it a useful tool for geospatial analysis and mapping applications.

## Features

- Convert longitude/latitude to GID and vice versa.
- Retrieve bounds for grid cells.
- Get geometries for grid cells.
- Find all grid cells that overlap with specified geometries.
- Easy integration with mapping libraries for geospatial applications.

## Installation

You can install the Geosquare Grid library using npm:

```bash
npm install geosquare-grid
```

## Usage

Here is a simple example of how to use the Geosquare Grid library:

```javascript
import { GeosquareGrid } from 'geosquare-grid';

// Initialize the GeosquareGrid object
const grid = new GeosquareGrid();

// Convert longitude and latitude to GID
const gid = grid.lonlatToGid(106.8938638928753022, -6.2608983083383016, 5);
console.log(`GID: ${gid}`);

// Convert GID back to longitude and latitude
const { longitude, latitude } = grid.gidToLonlat(gid);
console.log(`Longitude: ${longitude}, Latitude: ${latitude}`);

// Get bounds for the grid cell
const bounds = grid.getBounds(gid);
console.log(`Bounds: ${JSON.stringify(bounds)}`);
```

## Methods

### `lonlatToGid`
Converts geographic coordinates to a geospatial grid identifier (GID).

**Parameters:**
- `longitude` (float): Longitude in decimal degrees (-180 to 180).
- `latitude` (float): Latitude in decimal degrees (-90 to 90).
- `level` (int): Precision level (1-15).

**Returns:**
- `string`: Grid identifier.

---

### `gidToLonlat`
Converts a grid ID to geographic coordinates.

**Parameters:**
- `gid` (string): Grid identifier.

**Returns:**
- `Object`: An object containing `longitude` and `latitude` of the grid cell's lower-left corner.

---

### `gidToBound`
Converts a grid ID to its geographical bounds.

**Parameters:**
- `gid` (string): Grid identifier.

**Returns:**
- `Array`: Bounding box `[min_longitude, min_latitude, max_longitude, max_latitude]`.

---

### `getBounds`
Returns the geographic boundary of the grid cell.

**Parameters:**
- `gid` (string): Grid identifier.

**Returns:**
- `Array`: Bounding box `[min_longitude, min_latitude, max_longitude, max_latitude]`.

---

### `polyfill`
Finds all grid cells that intersect with a polygon.

**Parameters:**
- `geometry` (Object): Polygon geometry to fill.
- `size` (number | Array<number>): Grid cell size or range of sizes.
- `start` (string): Starting cell identifier (default: "2").
- `fullcover` (boolean): If `true`, only fully contained cells are returned.

**Returns:**
- `Array<string>`: List of grid cell identifiers.

## Documentation

For more detailed documentation, including advanced usage and API reference, please refer to the [docs](docs/index.rst).

## License

This project is licensed under the Apache License 2.0. See the LICENSE file for more details.