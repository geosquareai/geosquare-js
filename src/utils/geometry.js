import * as turf from '@turf/turf';

/**
 * Gets bounding box from array of coordinates
 * @param {Array<Array<number>>} coordinates - Array of [longitude, latitude] coordinates
 * @returns {Array<number>} Bounding box in [minX, minY, maxX, maxY] format
 */
export const getBounds = (coordinates) => {
    const points = coordinates.map(coord => turf.point(coord));
    const bbox = turf.bbox(turf.featureCollection(points));
    return bbox; // [minX, minY, maxX, maxY]
};

/**
 * Calculates the intersection between two polygons
 * @param {Array<Array<Array<number>>>} polygon1 - First polygon coordinates
 * @param {Array<Array<Array<number>>>} polygon2 - Second polygon coordinates
 * @returns {GeoJSON.Position[][] | GeoJSON.Position[][][]|null} Intersection coordinates or null if no intersection
 */
export const calculateIntersection = (polygon1, polygon2) => {
    const turfPolygon1 = turf.polygon(polygon1);
    const turfPolygon2 = turf.polygon(polygon2);
    const intersection = turf.intersect(turfPolygon1, turfPolygon2);
    return intersection ? intersection.geometry.coordinates : null;
};