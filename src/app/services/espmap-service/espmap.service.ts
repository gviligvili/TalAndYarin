import {Injectable} from '@angular/core';
import Map = L.Map;

interface Point {
  lat: number; lon: number;
}

@Injectable()
export class ESPMapService {

  private map: Map;

  registerMap(map: Map) {
    this.map = map;
  }

  flyToCluster(points: Point[]) {
    const lats = points.map(point => point.lat);
    const lngs = points.map(point => point.lon);

    const southEast = L.latLng(Math.min(...lats), Math.min(...lngs));
    const northWest = L.latLng(Math.max(...lats), Math.max(...lngs));

    // Padding to counter side and footer menus
    this.map.flyToBounds(L.latLngBounds(southEast, northWest), { paddingBottomRight: [400, 60],
                                                                 duration: 1,
                                                                 maxZoom: 15 });
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
