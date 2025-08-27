import * as turf from '@turf/turf';
/**
 * @typedef {Object} GridBounds
 * @property {[number, number]} west_south - The west and south coordinates [longitude, latitude]
 * @property {[number, number]} east_north - The east and north coordinates [longitude, latitude]
 */

/**
 * @typedef {[number, number, number, number]} BoundingBox - [minLongitude, minLatitude, maxLongitude, maxLatitude]
 */

/**
 * @typedef {Object} GeoPolygon
 * @property {string} type - The type of GeoJSON geometry
 * @property {Array<Array<[number, number]>>} coordinates - Polygon coordinates
 */

/**
 * @typedef {Object} CodeAlphabetMap
 * @property {Array<string>} grid5 - The full 5x5 grid alphabet flattened
 * @property {Array<string>} grid2 - The 2x2 grid alphabet subset
 * @property {Array<string>} c2 - The special c2 grid alphabet subset
 * @property {Array<string>} c12 - The special c12 grid alphabet subset
 */

/**
 * @typedef {Object<string, number>} AlphabetIndex
 */

/**
 * @typedef {Object<string, AlphabetIndex>} CodeAlphabetIndexMap
 */

/**
 * @typedef {Object<number, number>} SizeLevelMap
 */
import { validateCoordinates, validateGID } from './utils/validation';

/**
 * GeosquareGrid class for managing geospatial grid operations.
 * A flexible geospatial grid system for location encoding and spatial operations.
 * GeosquareGrid implements a hierarchical grid system that encodes geographic locations
 * into compact string identifiers (GIDs) and provides various spatial operations.
 * The grid divides the world into cells of varying resolution levels (1-15), where
 * each level increases the precision of location representation.
 * @class
 */
class GeosquareGrid {
    /**
     * Creates a new GeosquareGrid instance
     */
    constructor() {
        /** @type {number|null} */
        this.longitude = null;
        /** @type {number|null} */
        this.latitude = null;
        /** @type {number|null} */
        this.level = null;
        /** @type {string|null} */
        this.gid = null;
        
        /**
         * Base grid alphabet in 5x5 matrix
         * @type {Array<Array<string>>}
         */
        this.CODE_ALPHABET = [
            ["2", "3", "4", "5", "6"],
            ["7", "8", "9", "C", "E"],
            ["F", "G", "H", "J", "L"],
            ["M", "N", "P", "Q", "R"],
            ["T", "V", "W", "X", "Y"],
        ];
        
        /**
         * Pre-computed derived constants for faster lookups
         * @type {Object<string, Array<string>>}
         */
        this.CODE_ALPHABET_ = {
            5: this.CODE_ALPHABET.flat(),
            2: [...this.CODE_ALPHABET[0].slice(0, 2), ...this.CODE_ALPHABET[1].slice(0, 2)],
            "c2": ["2", "3"],
            "c12": ["V",
                "X",
                "N",
                "M",
                "F",
                "R",
                "P",
                "W",
                "H",
                "G",
                "Q",
                "L",
                "Y",
                "T",
                "J"],
        };
        
        /**
         * Maps characters to their [row, col] positions in the alphabet matrix
         * @type {Object<string, Array<number>>}
         */
        this.CODE_ALPHABET_VALUE = {};
        this.CODE_ALPHABET.forEach((row, rowIdx) => {
            row.forEach((char, colIdx) => {
                this.CODE_ALPHABET_VALUE[char] = [rowIdx, colIdx];
            });
        });
        
        /**
         * Maps alphabet types to indices for characters
         * @type {Object<string, Object<string, number>>}
         */
        this.CODE_ALPHABET_INDEX = {};
        for (const [key, values] of Object.entries(this.CODE_ALPHABET_)) {
            this.CODE_ALPHABET_INDEX[key] = {};
            values.forEach((val, idx) => {
                this.CODE_ALPHABET_INDEX[key][val] = idx;
            });
        }
        
        /**
         * Dimension values for each level
         * @type {Array<number>}
         */
        this.d = [5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5];
        
        /**
         * Mapping between size values and levels
         * @type {Object<number, number>}
         */
        this.size_level = {
             10000000: 1,
            5000000: 2,
            1000000: 3,
            500000: 4,
            100000: 5,
            50000: 6,
            10000: 7,
            5000: 8,
            1000: 9,
            500: 10,
            100: 11,
            50: 12,
            10: 13,
            5: 14,
            1: 15,
        };
    }

    /**
     * Convert geographic coordinates (longitude, latitude) to a geospatial grid identifier (GID).
     * @param {number} longitude - Longitude in decimal degrees.
     * @param {number} latitude - Latitude in decimal degrees.
     * @param {number} level - Precision level (1-15).
     * @returns {string} - Grid identifier.
     */
    lonlatToGID(longitude, latitude, level) {
        validateCoordinates(longitude, latitude);
        
        if (level < 1 || level > 15) {
            throw new Error("Level must be between 1 and 15");
        }
        
        let lat_ranged = [-216, 233.157642055036];
        let lon_ranged = [-217, 232.157642055036];
        let gid = '';
        for (let idx = 0; idx < level; idx++) {
            const position_x = Math.floor(
            ((longitude - lon_ranged[0]) / (lon_ranged[1] - lon_ranged[0])) *
            this.d[idx],
            );
            const position_y = Math.floor(
            ((latitude - lat_ranged[0]) / (lat_ranged[1] - lat_ranged[0])) *
            this.d[idx],
            );
            const part_x = (lon_ranged[1] - lon_ranged[0]) / this.d[idx];
            const part_y = (lat_ranged[1] - lat_ranged[0]) / this.d[idx];
            const shift_x = part_x * position_x;
            const shift_y = part_y * position_y;
            lon_ranged = [lon_ranged[0] + shift_x, lon_ranged[0] + shift_x + part_x];
            lat_ranged = [lat_ranged[0] + shift_y, lat_ranged[0] + shift_y + part_y];
            gid += this.CODE_ALPHABET[position_y][position_x];
        }
        return gid;
    }

    /**
     * Convert a grid ID (GID) to geographic coordinates (longitude, latitude).
     * @param {string} gid - Grid identifier.
     * @returns {Array<number>} - Array containing longitude and latitude.
     */
    gidToLonlat(gid) {
        validateGID(gid);
        
        let lat_ranged = [-216, 233.157642055036];
        let lon_ranged = [-217, 232.157642055036];
    
        for (let idx = 0; idx < gid.length; idx++) {
            const char = gid[idx];
            const part_x = (lon_ranged[1] - lon_ranged[0]) / this.d[idx];
            const part_y = (lat_ranged[1] - lat_ranged[0]) / this.d[idx];
            const shift_x = part_x * this.CODE_ALPHABET_VALUE[char][1];
            const shift_y = part_y * this.CODE_ALPHABET_VALUE[char][0];
            lon_ranged = [lon_ranged[0] + shift_x, lon_ranged[0] + shift_x + part_x];
            lat_ranged = [lat_ranged[0] + shift_y, lat_ranged[0] + shift_y + part_y];
        }

        const lon = (lon_ranged[0] + lon_ranged[1]) / 2;
        const lat = (lat_ranged[0] + lat_ranged[1]) / 2;
        return [lon, lat];
    }

    /**
     * Get the bounding box for the grid cell identified by the GID.
     * @param {string} gid - Grid identifier.
     * @returns {[number, number, number, number]} - Bounding box [minLongitude, minLatitude, maxLongitude, maxLatitude].
     */
    gidToBound(gid) {
        validateGID(gid);
        
        /** @type {[number, number]} */
        let lat_ranged = [-216, 233.157642055036];
        /** @type {[number, number]} */
        let lon_ranged = [-217, 232.157642055036];
    
        for (let idx = 0; idx < gid.length; idx++) {
            const char = gid[idx];
            const part_x = (lon_ranged[1] - lon_ranged[0]) / this.d[idx];
            const part_y = (lat_ranged[1] - lat_ranged[0]) / this.d[idx];
            const shift_x = part_x * this.CODE_ALPHABET_VALUE[char][1];
            const shift_y = part_y * this.CODE_ALPHABET_VALUE[char][0];
            lon_ranged = [lon_ranged[0] + shift_x, lon_ranged[0] + shift_x + part_x];
            lat_ranged = [lat_ranged[0] + shift_y, lat_ranged[0] + shift_y + part_y];
        }
    
        return /** @type {[number, number, number, number]} */ ([lon_ranged[0], lat_ranged[0], lon_ranged[1], lat_ranged[1]]);
    }

    /**
     * Initialize grid cell from longitude, latitude, and level.
     * @param {number} longitude - Longitude coordinate in WGS84 (must be between -180 and 180).
     * @param {number} latitude - Latitude coordinate in WGS84 (must be between -90 and 90).
     * @param {number} level - Grid level/resolution (must be between 1 and 15).
     * @returns {void}
     */
    fromLonlat(longitude, latitude, level) {
        validateCoordinates(longitude, latitude);
        
        if (level < 1 || level > 15) {
            throw new Error("Level must be between 1 and 15");
        }
        
        this.longitude = longitude;
        this.latitude = latitude;
        this.level = level;
        this.gid = this.lonlatToGID(this.longitude, this.latitude, this.level);
    }

    /**
     * Initialize cell attributes from a grid ID (GID).
     * @param {string} gid - A string representing the grid ID.
     * @returns {void}
     */
    fromGid(gid) {
        validateGID(gid);
        
        this.gid = gid;
        this.level = gid.length;
        [this.longitude, this.latitude] = this.gidToLonlat(this.gid);
    }

    /**
     * Get the geographic identifier (GID) for this grid cell.
     * @returns {string} - The geographic identifier (GID) for this grid cell.
     */
    getGid() {
        if (this.gid === null) {
            if (this.longitude === null || this.latitude === null || this.level === null) {
                throw new Error("Cannot get GID without longitude, latitude, and level");
            }
            this.gid = this.lonlatToGID(this.longitude, this.latitude, this.level);
        }
        return this.gid;
    }

    /**
     * Get the longitude and latitude coordinates for this grid cell.
     * @returns {[number, number]} - A tuple containing [longitude, latitude]
     */
    getLonlat() {
        if (this.longitude === null || this.latitude === null) {
            if (this.gid === null) {
                throw new Error("Cannot get lon/lat without GID");
            }
            [this.longitude, this.latitude] = this.gidToLonlat(this.gid);
        }
        return [this.longitude, this.latitude];
    }

    /**
     * Get the geographic boundary of the current grid cell.
     * @returns {[number, number, number, number]} - The bounding coordinates [west, south, east, north].
     * @throws {Error} - If gid is not set
     */
    getBound() {
        if (this.gid === null) {
            throw new Error("Cannot get bounds without GID");
        }
        return this.gidToBound(this.gid);
    }

    /**
     * Returns the polygon geometry of this grid cell.
     * @returns {turf.Feature<turf.Polygon>} - The polygon geometry as a GeoJSON object.
     * @throws {Error} - If gid is not set
     */
    getGeometry() {
        if (this.gid === null) {
            throw new Error("Cannot get geometry without GID");
        }
        return this.gidToGeometry(this.gid);
    }

    /**
     * Converts a grid ID to its corresponding polygon geometry.
     * @param {string} gid - The grid identifier to convert to a geometry.
     * @returns {turf.Feature<turf.Polygon>} - A GeoJSON polygon geometry representing the grid cell.
     */
    gidToGeometry(gid) {
        const bounds = this.gidToBound(gid);
        return turf.polygon([[
            [bounds[0], bounds[1]],
            [bounds[0], bounds[3]],
            [bounds[2], bounds[3]],
            [bounds[2], bounds[1]],
            [bounds[0], bounds[1]]
        ]]);
    }

    /**
     * Calculate the ratio of the intersection area between two shapes to the area of the first shape.
     * @param {turf.Feature<turf.Polygon|turf.MultiPolygon>} a - First GeoJSON geometry object.
     * @param {turf.Feature<turf.Polygon|turf.MultiPolygon>} b - Second GeoJSON geometry object.
     * @returns {number} - The area ratio (0.0 to 1.0).
     */
    _areaRatio(a, b) {
        const aArea = turf.area(a);
        const intersection = turf.intersect(a, b);
        if (!intersection) return 0;
        return parseFloat((turf.area(intersection) / aArea).toFixed(20));
    }

    /**
     * Convert a key to its child keys by appending characters from the code alphabet.
     * @param {string} key - The parent key string.
     * @returns {Array<string>} - Array of child keys.
     */
    _toChildren(key) {
        return this.CODE_ALPHABET_[this.d[key.length]].map(char => key + char);
    }

    /**
     * Convert a key to its parent key by removing the last character.
     * @param {string} key - The key to convert to parent.
     * @returns {string} - The parent key.
     */
    _toParent(key) {
        return key.length > 1 ? key.slice(0, -1) : key;
    }

    /**
     * Find grid cell keys contained within a specified geometry.
     * @param {turf.Feature<turf.Polygon|turf.MultiPolygon>} geometry - GeoJSON polygon geometry.
     * @param {string} initialKey - Starting grid key.
     * @param {Array<number>} resolution - [min_resolution, max_resolution] array.
     * @param {boolean} fullcover - Whether to include only fully contained cells.
     * @returns {Array<string>} - List of contained grid keys.
     */
    _getContainedKeys(geometry, initialKey, resolution, fullcover = true) {
        if (initialKey !== "2") {
            const intersection = turf.intersect(geometry, this.gidToGeometry(initialKey));
            if (!intersection) return [];
            geometry = intersection;
        }
        
        /** @type {Array<string>} */
        const containedKeys = [];
        
        /**
         * @typedef {Object} ProcessKeyOptions
         * @property {string} key - The key being processed
         * @property {boolean} approved - Whether the key is pre-approved
         */

        /**
         * Process a key recursively to find contained cells
         * @param {string} key - The key to process
         * @param {boolean} approved - Whether the key is pre-approved
         * @returns {void}
         */
        const processKey = (key, approved) => {
            if (approved) {
            if (key.length >= resolution[0] && key.length <= resolution[1]) {
                containedKeys.push(key);
            } else {
                this._toChildren(key).forEach(childKey => {
                processKey(childKey, true);
                });
            }
            } else {
            const cellGeom = this.gidToGeometry(key);
            const areaRatio = this._areaRatio(cellGeom, geometry);
            
            if (areaRatio === 0) {
                if (key.length === 1) {
                const lastChar = key[key.length - 1];
                const lastIdx = this.CODE_ALPHABET_[this.d[0]].indexOf(lastChar);
                if (lastIdx < 25) {
                    const nextChar = this.CODE_ALPHABET_[this.d[0]][lastIdx + 1];
                    processKey(key.slice(0, -1) + nextChar, false);
                }
                }
                return;
            } else if (areaRatio === 1) {
                processKey(key, true);
            } else if (key.length === resolution[1] && fullcover) {
                containedKeys.push(key);
            } else if (key.length === resolution[1] && areaRatio > 0.5 && !fullcover) {
                containedKeys.push(key);
            } else if (key.length === resolution[1]) {
                return;
            } else {
                this._toChildren(key).forEach(childKey => {
                processKey(childKey, false);
                });
            }
            }
        };
        
        processKey(initialKey, false);
        return containedKeys;
    }

    /**
     * Generates all child grid identifiers at a specified resolution level from a parent GID.
     * @param {string} key - The parent grid identifier (GID).
     * @param {number} size - The target size parameter for resolution level.
     * @param {turf.Feature<turf.Polygon|turf.MultiPolygon>|null} geometry - Optional GeoJSON geometry to filter cells.
     * @returns {Array<string>} - List of child grid identifiers.
     */
    parrentToAllchildren(key, size, geometry = null) {
        const resolution = this.size_level[size];
        const parrentResolution = key.length;
        
        if (resolution < parrentResolution) {
            throw new Error("Resolution must be less than or equal to the length of the GID");
        }
        
        if (resolution === parrentResolution) {
            return [key];
        }
        
        const keys = [];
        const queue = [key];
        
        while (queue.length > 0) {
            const currentKey = queue.shift();
            
            if (!currentKey) continue;
            
            if (currentKey.length === resolution) {
                if (geometry !== null) {
                    if (this._areaRatio(this.gidToGeometry(currentKey), geometry) > 0) {
                        keys.push(currentKey);
                    }
                } else {
                    keys.push(currentKey);
                }
            } else if (currentKey.length > resolution) {
                break;
            } else {
                this._toChildren(currentKey).forEach(childKey => {
                    queue.push(childKey);
                });
            }
        }
        
        return keys;
    }

    /**
     * Find all grid cells that intersect with a given polygon.
     * @param {turf.Feature<turf.Polygon|turf.MultiPolygon>} polygon - GeoJSON polygon object.
     * @param {number|Array<number>} size - Size level or range [min, max].
     * @param {string} [start="2"] - Starting cell identifier.
     * @param {boolean} [fullcover=true] - Whether to include only fully contained cells.
     * @returns {Array<string>} - List of grid identifiers that intersect with the polygon.
     */
    polyfill(polygon, size, start = "2", fullcover = true) {
        /** @type {[number, number]} */
        let resolution;
        
        if (Array.isArray(size)) {
            if (size[0] <= size[1]) {
                throw new Error("Size must be in [min, max] format");
            }
            
            if (!this.size_level[size[0]] || !this.size_level[size[1]]) {
                throw new Error(`Size must be one of: ${Object.keys(this.size_level).join(', ')}`);
            }
            
            resolution = [this.size_level[size[0]], this.size_level[size[1]]];
        } else {
            if (!this.size_level[size]) {
                throw new Error(`Size must be one of: ${Object.keys(this.size_level).join(', ')}`);
            }
            
            resolution = [this.size_level[size], this.size_level[size]];
        }
        
        return this._getContainedKeys(polygon, start, resolution, fullcover);
    }

}

export default GeosquareGrid;
