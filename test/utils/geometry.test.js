import { calculateBounds, intersectPolygons } from '../../src/utils/geometry';
import { polygon } from '@turf/helpers';

describe('Geometry Utility Functions', () => {
    test('calculateBounds should return the correct bounds for a polygon', () => {
        const poly = polygon([[
            [106.82, -6.86],
            [106.892, -6.86],
            [106.892, -6.78],
            [106.82, -6.78],
            [106.82, -6.86]
        ]]);

        const bounds = calculateBounds(poly);
        expect(bounds).toEqual({
            minLongitude: 106.82,
            minLatitude: -6.86,
            maxLongitude: 106.892,
            maxLatitude: -6.78
        });
    });

    test('intersectPolygons should return true for intersecting polygons', () => {
        const poly1 = polygon([[
            [106.82, -6.86],
            [106.892, -6.86],
            [106.892, -6.78],
            [106.82, -6.78],
            [106.82, -6.86]
        ]]);

        const poly2 = polygon([[
            [106.85, -6.80],
            [106.90, -6.80],
            [106.90, -6.75],
            [106.85, -6.75],
            [106.85, -6.80]
        ]]);

        const result = intersectPolygons(poly1, poly2);
        expect(result).toBe(true);
    });

    test('intersectPolygons should return false for non-intersecting polygons', () => {
        const poly1 = polygon([[
            [106.82, -6.86],
            [106.892, -6.86],
            [106.892, -6.78],
            [106.82, -6.78],
            [106.82, -6.86]
        ]]);

        const poly2 = polygon([[
            [107.0, -7.0],
            [107.1, -7.0],
            [107.1, -7.1],
            [107.0, -7.1],
            [107.0, -7.0]
        ]]);

        const result = intersectPolygons(poly1, poly2);
        expect(result).toBe(false);
    });
});