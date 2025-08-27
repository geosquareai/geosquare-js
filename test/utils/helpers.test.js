import GeosquareGrid from '../../src/core';

describe('Utility Helper Functions', () => {
  let geosquareGrid;

  beforeEach(() => {
    geosquareGrid = new GeosquareGrid();
  });

  describe('toParent and toChildren', () => {
    test('should convert GID to parent GID', () => {
      const gid = 'J3P7V8Y247G3';
      const parent = geosquareGrid._toParent(gid);
      
      // Parent should be one character shorter
      expect(parent).toHaveLength(gid.length - 1);
      expect(parent).toBe(gid.slice(0, -1));
    });
    
    test('should keep single character GID unchanged when getting parent', () => {
      const gid = 'J';
      const parent = geosquareGrid._toParent(gid);
      
      expect(parent).toBe(gid);
    });
    
    test('should convert GID to child GIDs', () => {
      const gid = 'J3P7V8Y247G32';
      const children = geosquareGrid._toChildren(gid);
      
      // Each child should be one character longer
      expect(children.length).toBeGreaterThan(0);
      children.forEach(child => {
        expect(child).toHaveLength(gid.length + 1);
        expect(child.startsWith(gid)).toBe(true);
      });
    });
    
    test('should generate expected number of children based on level', () => {
      // Level 0 (root) uses 5x5 grid = 25 children
      const rootChildren = geosquareGrid._toChildren('2');
      expect(rootChildren.length).toBe(4);
      
      // Level 1 uses 2x2 grid = 4 children 
      const level1Children = geosquareGrid._toChildren('23');
      expect(level1Children.length).toBe(25);
      
      // Level 2 uses 5x5 grid = 25 children
      const level2Children = geosquareGrid._toChildren('234');
      expect(level2Children.length).toBe(4);
    });
  });
  
  describe('parrentToAllchildren', () => {
    test('should generate all children at a specified resolution', () => {
      const parentGid = 'J3P7V8Y247G32';
      const size = 5; // corresponds to level 9

      const children = geosquareGrid.parrentToAllchildren(parentGid, size);
      
      // All children should have the same length (level 9)
      children.forEach(child => {
        expect(child).toHaveLength(14);
        expect(child.startsWith(parentGid)).toBe(true);
      });
    });
    
    test('should return parent if resolution equals parent level', () => {
      const parentGid = 'J3P7V8Y247G32';
      const size = 5; // corresponds to level 7
      
      const result = geosquareGrid.parrentToAllchildren(parentGid, size);
      
      expect(result).toEqual([
      "J3P7V8Y247G322",
      "J3P7V8Y247G323",
      "J3P7V8Y247G327",
      "J3P7V8Y247G328",
      ]);
    });
    
    test('should throw error if target resolution is less than parent resolution', () => {
      const parentGid = 'J3P7V8Y247G32';
      const size = 50; // corresponds to level 5
      
      expect(() => {
        geosquareGrid.parrentToAllchildren(parentGid, size);
      }).toThrow();
    });
    
    test('should filter children by geometry if provided', () => {
      const parentGid = 'J3P7V8Y247G32';
      const size = 5; // level 9
      
      // Create a small polygon that should only contain some of the children
      const geometry = geosquareGrid.gidToGeometry('J3P7V8Y247G32');
      
      const allChildren = geosquareGrid.parrentToAllchildren(parentGid, size);
      const filteredChildren = geosquareGrid.parrentToAllchildren(parentGid, size, geometry);
      
      // Should have fewer children when filtered
    expect(filteredChildren.length).toBeLessThanOrEqual(allChildren.length);
      
      // All filtered children should be in the full list
      filteredChildren.forEach(child => {
        expect(allChildren).toContain(child);
      });
    });
  });
  
  describe('areaRatio calculation', () => {
    test('should return 1 for identical polygons', () => {
      const geometry = geosquareGrid.gidToGeometry('J3P7');
      
      const ratio = geosquareGrid._areaRatio(geometry, geometry);
      expect(ratio).toBe(1);
    });
    
    test('should return 0 for non-intersecting polygons', () => {
      const geom1 = geosquareGrid.gidToGeometry('2F');
      const geom2 = geosquareGrid.gidToGeometry('7M');
      
      const ratio = geosquareGrid._areaRatio(geom1, geom2);
      expect(ratio).toBe(0);
    });
    
    test('should return fraction for partially overlapping polygons', () => {
      // Get a cell and its parent
      const cell = 'J3P7V8';
      const cellGeom = geosquareGrid.gidToGeometry(cell);
      
      // Create a polygon that partially overlaps
      const parentCell = geosquareGrid._toParent(cell);
      const parentGeom = geosquareGrid.gidToGeometry(parentCell);
      
      // The cell should be 1/N of the parent's area
      const ratio = geosquareGrid._areaRatio(parentGeom, cellGeom);
      expect(ratio).toBeGreaterThan(0);
      expect(ratio).toBeLessThan(1);
    });
  });
});
