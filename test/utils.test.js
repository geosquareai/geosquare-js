import { validateCoordinates, validateGID } from '../src/utils/validation';
import { getBounds, calculateIntersection } from '../src/utils/geometry';
import * as turf from '@turf/turf';

describe('Validation Utilities', () => {
  test('should validate valid coordinates', () => {
    expect(() => {
      validateCoordinates(100, 40);
    }).not.toThrow();
  });
  
  test('should throw error for invalid longitude', () => {
    expect(() => {
      validateCoordinates(200, 40);
    }).toThrow();
  });
  
  test('should throw error for invalid latitude', () => {
    expect(() => {
      validateCoordinates(100, 100);
    }).toThrow();
  });
  
  test('should validate valid GID', () => {
    expect(() => {
      validateGID('2FNRQ');
    }).not.toThrow();
  });
  
  test('should throw error for invalid GID', () => {
    expect(() => {
      validateGID('2FNRQA'); // Invalid character
    }).toThrow();
  });
});

describe('Geometry Utilities', () => {
  test('should calculate bounds correctly', () => {
    const coordinates = [
      [100, 0],
      [101, 0],
      [101, 1],
      [100, 1]
    ];
    
    const bounds = getBounds(coordinates);
    expect(bounds).toHaveLength(4);
    expect(bounds[0]).toBeCloseTo(100);
    expect(bounds[1]).toBeCloseTo(0);
    expect(bounds[2]).toBeCloseTo(101);
    expect(bounds[3]).toBeCloseTo(1);
  });
  
  test('should calculate intersection correctly', () => {
    const polygon1 = [
      [[0, 0], [0, 2], [2, 2], [2, 0], [0, 0]]
    ];
    
    const polygon2 = [
      [[1, 1], [1, 3], [3, 3], [3, 1], [1, 1]]
    ];
    
    const intersection = calculateIntersection(polygon1, polygon2);
    expect(intersection).not.toBeNull();
    // The intersection should be a square from [1,1] to [2,2]
    expect(intersection[0].length).toBe(5); // 4 corners + closing point
  });
  
  test('should return null for non-intersecting polygons', () => {
    const polygon1 = [
      [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]
    ];
    
    const polygon2 = [
      [[2, 2], [2, 3], [3, 3], [3, 2], [2, 2]]
    ];
    
    const intersection = calculateIntersection(polygon1, polygon2);
    expect(intersection).toBeNull();
  });
});
