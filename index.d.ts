declare module 'geosquare-grid' {
  export class GeosquareGrid {
    constructor();
    lonlatToGID(longitude: number, latitude: number, level: number): string;
    gidToLonlat(gid: string): [number, number];
    gidToBound(gid: string): [number, number, number, number];
    fromLonlat(longitude: number, latitude: number, level: number): void;
    fromGid(gid: string): void;
    getGid(): string;
    getLonlat(): [number, number];
    getBound(): [number, number, number, number];
    getGeometry(): any; // GeoJSON Polygon
    gidToGeometry(gid: string): any; // GeoJSON Polygon
    polyfill(polygon: any, size: number | [number, number], start?: string, fullcover?: boolean): string[];
  }

  export function fromLonLat(longitude: number, latitude: number, level: number): GeosquareGrid;
  export function getBounds(gid: string): [number, number, number, number];
  export function polyfill(polygon: any, size: number | [number, number], start?: string, fullcover?: boolean): string[];
  export function lonlatToGID(longitude: number, latitude: number, level: number): string;
  export function GIDToLonlat(gid: string): [number, number];
  export function getGeometry(gid: string): any; // GeoJSON Polygon

  export default GeosquareGrid;
}
