import {Injectable} from '@angular/core';
import Map = L.Map;
import Layer = L.Layer;
import * as cloneLayer from 'leaflet-clonelayer';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import LatLngExpression = L.LatLngExpression;
import LatLngTuple = L.LatLngTuple;

interface Point {
  lat: number; lon: number;
}

@Injectable()
export class ESPMapService {

  private map: Map;
  private assistantMap: Map;
  private onMapRegistered$: BehaviorSubject<any> = new BehaviorSubject(null);

  registerMaps(mainMap: Map, assistantMap: Map) {
    this.map = mainMap;
    this.assistantMap = assistantMap;
    this.mapsInit(this.map, this.assistantMap);
    this.onMapRegistered$.next({ mainMap: mainMap, assistantMap: assistantMap});
  }

  getOnMapRegistered$(): BehaviorSubject<any> {
    return this.onMapRegistered$;
  }

  /**
   * Init the maps, YOU NEED map and assistant map already initialized !
   */
  mapsInit(mMap, aMap) {
    const tilesLayers = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    this.addLayer(tilesLayers);

    // Add measure control with imperial units (miles)
    const mMeasureTool = L.control.polylineMeasure({ imperial: true }).addTo(mMap);
    const aMeasureTool = L.control.polylineMeasure({ imperial: true }).addTo(aMap);
  }

  addLayer(newLayer: Layer) {
    const cloned = cloneLayer(newLayer);
    const mLayer = this.map.addLayer(newLayer);
    const aLayer = this.assistantMap.addLayer(cloned);

    return { mainLayer: mLayer, assistantLayer: aLayer };
  }

  flyToCluster(points: Point[]) {
    const lats = points.map(point => point.lat);
    const lngs = points.map(point => point.lon);

    const southEast = L.latLng(Math.min(...lats), Math.min(...lngs));
    const northWest = L.latLng(Math.max(...lats), Math.max(...lngs));

    // Padding to counter side and footer menus
    this.map.flyToBounds(L.latLngBounds(southEast, northWest), { duration: 1,
                                                                 maxZoom: 12 });
    this.assistantMap.flyToBounds(L.latLngBounds(southEast, northWest), { duration: 1,
      maxZoom: 12 });
  }

  flyToPoint(lat,lng, zoom = 12, zoomPanOptions = {}) {
    let zpOptions = {
      duration: 1,
      maxZoom: 12
    };
    let options = Object.assign(zpOptions, zoomPanOptions);

    this.map.flyTo([lat, lng], zoom , options)
    this.assistantMap.flyTo([lat, lng], zoom , options)
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
