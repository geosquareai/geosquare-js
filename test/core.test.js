import GeosquareGrid from '../src/core';
import * as turf from '@turf/turf';

describe('GeosquareGrid', () => {
  let geosquareGrid;

  beforeEach(() => {
    geosquareGrid = new GeosquareGrid();
  });

  describe('lonlatToGID and gidToLonlat', () => {
    test('should convert coordinates to GID and back', () => {
      const longitude = 106.83709523033119;
      const latitude = -6.216940270134019;
      const level = 5;
      
      const gid = geosquareGrid.lonlatToGID(longitude, latitude, level);
      expect(gid).toHaveLength(level);
      
      const [recoveredLon, recoveredLat] = geosquareGrid.gidToLonlat(gid);
      
      // Allow for small floating-point precision differences
      expect(recoveredLon).toBeCloseTo(longitude, 0.0001);
      expect(recoveredLat).toBeCloseTo(latitude, 0.0001);
    });
    
    test('should throw error for invalid coordinates', () => {
      expect(() => {
        geosquareGrid.lonlatToGID(200, 100, 5);
      }).toThrow();
    });
    
    test('should throw error for invalid level', () => {
      expect(() => {
        geosquareGrid.lonlatToGID(100, 0, 16);
      }).toThrow();
    });
    
    test('should convert specific coordinates to expected GID', () => {
      const longitude = 106.83709523033119;
      const latitude = -6.216940270134019;
      const level = 14;
      const expectedGid = 'J3N2M763L7X3X2';
      
      const gid = geosquareGrid.lonlatToGID(longitude, latitude, level);
      expect(gid).toBe(expectedGid);
    });
    
    test('should convert specific GID to expected coordinates', () => {
      const gid = 'J3P7V8Y247G3';
      const expectedCoordinates = [117.10299251796522, -0.4876505561838957];
      
      const coordinates = geosquareGrid.gidToLonlat(gid);
      expect(coordinates[0]).toBeCloseTo(expectedCoordinates[0], 10);
      expect(coordinates[1]).toBeCloseTo(expectedCoordinates[1], 10);
    });
  });
  
  describe('gidToBound', () => {
    test('should return correct bounds for a GID', () => {
      const gid = '2FNRQ';
      const bounds = geosquareGrid.gidToBound(gid);
      
      expect(bounds).toHaveLength(4);
      expect(bounds[0]).toBeLessThan(bounds[2]); // minLon < maxLon
      expect(bounds[1]).toBeLessThan(bounds[3]); // minLat < maxLat
    });
    
    test('should return expected bounds for specific GID', () => {
      const gid = 'J3P7V8Y247G3';
      const expectedBounds = [
        117.1027679391442,
        -0.4878751350049232,
        117.10321709678625,
        -0.4874259773628682
      ];
      
      const bounds = geosquareGrid.gidToBound(gid);
      
      expect(bounds.length).toBe(4);
      expect(bounds[0]).toBeCloseTo(expectedBounds[0], 10);
      expect(bounds[1]).toBeCloseTo(expectedBounds[1], 10);
      expect(bounds[2]).toBeCloseTo(expectedBounds[2], 10);
      expect(bounds[3]).toBeCloseTo(expectedBounds[3], 10);
    });
  });
  
  describe('fromLonlat and fromGid', () => {
    test('should initialize from coordinates', () => {
      geosquareGrid.fromLonlat(103.8198, 1.3521, 5);
      
      expect(geosquareGrid.longitude).toBeCloseTo(103.8198);
      expect(geosquareGrid.latitude).toBeCloseTo(1.3521);
      expect(geosquareGrid.level).toBe(5);
      expect(geosquareGrid.gid).toHaveLength(5);
    });
    
    test('should initialize from GID', () => {
      const gid = '2FNRQ';
      geosquareGrid.fromGid(gid);
      
      expect(geosquareGrid.gid).toBe(gid);
      expect(geosquareGrid.level).toBe(gid.length);
      expect(geosquareGrid.longitude).toBeDefined();
      expect(geosquareGrid.latitude).toBeDefined();
    });
  });
  
  describe('polygon operations', () => {
    test('should create geometry from GID', () => {
      const gid = '2FNRQ';
      const geometry = geosquareGrid.gidToGeometry(gid);
      
      expect(geometry.type).toBe('Feature');
      expect(geometry.geometry.type).toBe('Polygon');
    });
    
    test('should calculate area ratio correctly', () => {
      const polygon1 = turf.polygon([[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]]);
      const polygon2 = turf.polygon([[[0.5, 0.5], [0.5, 1.5], [1.5, 1.5], [1.5, 0.5], [0.5, 0.5]]]);
      
      const ratio = geosquareGrid._areaRatio(polygon1, polygon2);
      expect(ratio).toBeGreaterThan(0);
      expect(ratio).toBeLessThan(1);
    });
    
    test('should find contained keys', () => {
      // Create a test polygon
      const polygon = turf.polygon([
        [[100, 0], [100, 1], [101, 1], [101, 0], [100, 0]]
      ]);
      
      const keys = geosquareGrid._getContainedKeys(polygon, '2', [1, 2], true);
      expect(Array.isArray(keys)).toBe(true);
    });
    
    test('should return expected geometry for specific GID', () => {
      const gid = 'J3P7V8Y247G3';
      const expectedGeometry = {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [117.1027679391442, -0.4878751350049232],
              [117.1027679391442, -0.4874259773628682],
              [117.10321709678625, -0.4874259773628682],
              [117.10321709678625, -0.4878751350049232],
              [117.1027679391442, -0.4878751350049232]
            ]
          ]
        }
      };
      
      const geometry = geosquareGrid.gidToGeometry(gid);
      
      // Compare stringified JSON to handle deep object comparison
      const geometryStr = JSON.stringify(geometry);
      const expectedStr = JSON.stringify(expectedGeometry);
      
      // Compare coordinates with precision
      const coords = geometry.geometry.coordinates[0];
      const expectedCoords = expectedGeometry.geometry.coordinates[0];
      
      for (let i = 0; i < coords.length; i++) {
        expect(coords[i][0]).toBeCloseTo(expectedCoords[i][0], 10);
        expect(coords[i][1]).toBeCloseTo(expectedCoords[i][1], 10);
      }
      
      // Check structure
      expect(geometry.type).toBe(expectedGeometry.type);
      expect(geometry.geometry.type).toBe(expectedGeometry.geometry.type);
    });
    
    test('should return expected cells for polyfill with specific GID', () => {
      const gid = 'J3P7V8Y247G3';
      const size = 10;
      const expectedCells = [
        'J3P7V8Y247G32', 'J3P7V8Y247G33',
        'J3P7V8Y247G34', 'J3P7V8Y247G35',
        'J3P7V8Y247G36', 'J3P7V8Y247G37',
        'J3P7V8Y247G38', 'J3P7V8Y247G39',
        'J3P7V8Y247G3C', 'J3P7V8Y247G3E',
        'J3P7V8Y247G3F', 'J3P7V8Y247G3G',
        'J3P7V8Y247G3H', 'J3P7V8Y247G3J',
        'J3P7V8Y247G3L', 'J3P7V8Y247G3M',
        'J3P7V8Y247G3N', 'J3P7V8Y247G3P',
        'J3P7V8Y247G3Q', 'J3P7V8Y247G3R',
        'J3P7V8Y247G3T', 'J3P7V8Y247G3V',
        'J3P7V8Y247G3W', 'J3P7V8Y247G3X',
        'J3P7V8Y247G3Y'
      ];
      
      const geometry = geosquareGrid.gidToGeometry(gid);
      const cells = geosquareGrid.polyfill(geometry, size);
      
      // Check if all expected cells are present
      expect(cells.length).toBe(expectedCells.length);
      expectedCells.forEach(cell => {
        expect(cells).toContain(cell);
      });
    });
  });
});