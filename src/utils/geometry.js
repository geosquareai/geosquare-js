// filepath: geosquare-grid-js/geosquare-grid-js/src/utils/geometry.js
import turf from '@turf/turf';

export const getBounds = (coordinates) => {
    const points = coordinates.map(coord => turf.point(coord));
    const bbox = turf.bbox(turf.featureCollection(points));
    return bbox; // [minX, minY, maxX, maxY]
};

export const calculateIntersection = (polygon1, polygon2) => {
    const turfPolygon1 = turf.polygon(polygon1);
    const turfPolygon2 = turf.polygon(polygon2);
    const intersection = turf.intersect(turfPolygon1, turfPolygon2);
    return intersection ? intersection.geometry.coordinates : null;
};