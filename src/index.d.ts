import * as turf from '@turf/turf';

declare class GeosquareGrid {
  constructor();

  longitude: number | null;
  latitude: number | null;
  level: number | null;
  gid: string | null;
  
  CODE_ALPHABET: string[][];
  CODE_ALPHABET_: Record<string | number, string[]>;
  CODE_ALPHABET_VALUE: Record<string, [number, number]>;
  CODE_ALPHABET_INDEX: Record<string, Record<string, number>>;
  d: number[];
  size_level: Record<number, number>;

  lonlatToGID(longitude: number, latitude: number, level: number): string;
  gidToLonlat(gid: string): [number, number];
  gidToBound(gid: string): [number, number, number, number];
  
  fromLonlat(longitude: number, latitude: number, level: number): void;
  fromGid(gid: string): void;
  
  getGid(): string;
  getLonlat(): [number, number];
  getBound(): [number, number, number, number];
  getGeometry(): turf.Feature<turf.Polygon>;
  
  gidToGeometry(gid: string): turf.Feature<turf.Polygon>;
  
  _areaRatio(a: turf.Feature<turf.Polygon | turf.MultiPolygon>, 
             b: turf.Feature<turf.Polygon | turf.MultiPolygon>): number;
  _toChildren(key: string): string[];
  _toParent(key: string): string;
  
  _getContainedKeys(
    geometry: turf.Feature<turf.Polygon | turf.MultiPolygon>,
    initialKey: string,
    resolution: [number, number],
    fullcover?: boolean
  ): string[];
  
  parrentToAllchildren(
    key: string, 
    size: number, 
    geometry?: turf.Feature<turf.Polygon | turf.MultiPolygon> | null
  ): string[];
  
  polyfill(
    polygon: turf.Feature<turf.Polygon | turf.MultiPolygon>,
    size: number | [number, number],
    start?: string,
    fullcover?: boolean
  ): string[];
}

declare const _default: typeof GeosquareGrid;
export default _default;

export namespace utils {
  export function validateCoordinates(longitude: number, latitude: number): void;
  export function validateGID(gid: string): void;
  
  export namespace geometry {
    export function getBounds(coordinates: number[][]): [number, number, number, number];
    export function calculateIntersection(
      polygon1: number[][][], 
      polygon2: number[][][]
    ): number[][][] | null;
  }
}
