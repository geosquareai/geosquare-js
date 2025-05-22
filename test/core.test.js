import { lonlatToGid, gidToLonlat, gidToBound } from '../src/core';
import { point } from '@turf/helpers';
import turfBbox from '@turf/bbox';

describe('Geosquare Grid Core Functions', () => {
    test('Convert longitude and latitude to GID', () => {
        const gid = lonlatToGid(106.894082, -6.26109, 7);
        expect(gid).toBe('J3N2M3T8M342');
    });

    test('Convert GID back to longitude and latitude', () => {
        const { longitude, latitude } = gidToLonlat('J3N2M3T8M342');
        expect(longitude).toBeCloseTo(106.894082, 5);
        expect(latitude).toBeCloseTo(-6.26109, 5);
    });

    test('Get bounds for a grid cell', () => {
        const bounds = gidToBound('J3N2M3T8M342');
        expect(bounds).toEqual(expect.arrayContaining([
            expect.any(Number), // min_longitude
            expect.any(Number), // min_latitude
            expect.any(Number), // max_longitude
            expect.any(Number)  // max_latitude
        ]));
    });

    test('Calculate bounding box using Turf.js', () => {
        const geom = point([106.894082, -6.26109]);
        const bbox = turfBbox(geom);
        expect(bbox).toEqual(expect.arrayContaining([
            expect.any(Number), // min_longitude
            expect.any(Number), // min_latitude
            expect.any(Number), // max_longitude
            expect.any(Number)  // max_latitude
        ]));
    });
});