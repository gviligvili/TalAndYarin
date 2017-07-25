import { Injectable } from '@angular/core';
import {ESPMapService} from "./espmap-service/espmap.service";
import {ESPMarker} from "../interfaces/ESPMarker.interface";
import Map = L.Map;
import Marker = L.Marker;

@Injectable()
export class MarkerLayerManager {

  private _id = 0;
  private _markers = {};
  mMarkerLayer = new L.FeatureGroup();
  aMarkerLayer = new L.FeatureGroup();

  constructor(private espMapService: ESPMapService) {
    this.espMapService.getOnMapRegistered$().subscribe((maps) => {
      this.registerMarkerLayer(maps.mainMap, maps.assistantMap);
    });
  }

  registerMarkerLayer(mMap: Map, aMap: Map) {
    this.mMarkerLayer.addTo(mMap);
    this.aMarkerLayer.addTo(aMap);
  }

  addMarker(marker: ESPMarker) {
    // Generate id for this marker
    marker._id = this._id.toString();
    this._id++;

    // Create and add.
    const layerMarker = L.marker([marker.lat, marker.lng])
      .setIcon(L.icon({
        iconUrl: marker.iconUrl,
        iconSize: marker.iconSize,
        iconAnchor: [marker.iconSize[0] / 2, marker.iconSize[1] / 2]
      }))
      .on('click', () => marker.markerClick.emit());

    this._markers[marker._id] = marker;
    debugger;
    layerMarker.addTo(this.mMarkerLayer);
    layerMarker.addTo(this.mMarkerLayer);
  }

  deleteMarker(marker: ESPMarker) {
    const m = this._markers[marker._id];
    if (m != null) {
      // this.aMarkerLayer.removeLayer();
      // this.aMarkerLayer.remove(m);
    }
  }

  // updateMarkerPosition(marker: ESPMarker): Promise<void> {
  //   return this._markers.get(marker).then(
  //     (m: Marker) => m.setPosition({lat: marker.latitude, lng: marker.longitude}));
  // }
  //
  // updateTitle(marker: ESPMarker): Promise<void> {
  //   return this._markers.get(marker).then((m: Marker) => m.setTitle(marker.title));
  // }
  //
  // updateLabel(marker: ESPMarker): Promise<void> {
  //   return this._markers.get(marker).then((m: Marker) => { m.setLabel(marker.label); });
  // }
  //
  // updateDraggable(marker: ESPMarker): Promise<void> {
  //   return this._markers.get(marker).then((m: Marker) => m.setDraggable(marker.draggable));
  // }
  //
  // updateIcon(marker: ESPMarker): Promise<void> {
  //   return this._markers.get(marker).then((m: Marker) => m.setIcon(marker.iconUrl));
  // }
  //
  // updateOpacity(marker: ESPMarker): Promise<void> {
  //   return this._markers.get(marker).then((m: Marker) => m.setOpacity(marker.opacity));
  // }
  //
  // updateVisible(marker: ESPMarker): Promise<void> {
  //   return this._markers.get(marker).then((m: Marker) => m.setVisible(marker.visible));
  // }
  //
  // updateZIndex(marker: ESPMarker): Promise<void> {
  //   return this._markers.get(marker).then((m: Marker) => m.setZIndex(marker.zIndex));
  // }
  //
  // updateClickable(marker: ESPMarker): Promise<void> {
  //   return this._markers.get(marker).then((m: Marker) => m.setClickable(marker.clickable));
  // }


  getNativeMarker(marker: ESPMarker): Marker {
    return this._markers[marker._id];
  }
}
