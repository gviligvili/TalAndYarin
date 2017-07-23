import {Injectable} from '@angular/core';

interface Point {
  lat: number; lon: number;
}

@Injectable()
export class ESPMapService {

  setCenter(lat: number, lon: number) {
    //TODO
  }

  setZoom(zoomLevel: number) {
    //TODO
  }

  /**
   * Get points (any object), which has 'lat'  and 'lon' property
   * @param Points
   */
  calculateCentroid(Points: Point[]) {
    let outputlat = 0;
    let outputlon = 0;

    Points.forEach((p) => {
      outputlat += p.lat;
      outputlon += p.lon;
    });

    outputlat = outputlat / Points.length;
    outputlon = outputlon / Points.length;

    return {'lat': outputlat, 'lon': outputlon};
  }
}
