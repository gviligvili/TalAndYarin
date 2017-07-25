import { Injectable } from '@angular/core';
import {ESPMapService} from "./espmap-service/espmap.service";
import {ESPMarker} from "../interfaces/ESPMarker.interface";
import Map = L.Map;
import Marker = L.Marker;

@Injectable()
export class MarkerLayerManager {

  private _id = 0;
  private _markers = {};
  mMarkerLayer =  L.featureGroup([], {
    makeBoundsAware: true
  });
  aMarkerLayer =  L.featureGroup([], {
    makeBoundsAware: true
  });

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
    const mlayerMarker = L.marker([marker.lat, marker.lng])
      .setIcon(this.createMarkerIcon(marker))
      .on('click', () => marker.markerClick.emit());

    // Create and add.
    const alayerMarker = L.marker([marker.lat, marker.lng])
      .setIcon(L.icon({
        iconUrl: marker.iconUrl,
        iconSize: marker.iconSize,
        iconAnchor: [marker.iconSize[0] / 2, marker.iconSize[1] / 2]
      }))
      .on('click', () => marker.markerClick.emit());


    let mMarker = mlayerMarker.addTo(this.mMarkerLayer);
    let aMarker = alayerMarker.addTo(this.aMarkerLayer);
    this._markers[marker._id] = [mMarker, aMarker];
  }

  deleteMarker(marker: ESPMarker) {
    const markers = this._markers[marker._id];
    if (markers != null) {
      this.mMarkerLayer.removeLayer(markers[0]._leaflet_id);
      this.aMarkerLayer.removeLayer(markers[1]._leaflet_id);
    }
  }

  updateMarkerPosition(espMarker: ESPMarker) {
    const markersArr = this.getNativeMarker(espMarker);
    markersArr.forEach((m) => {
      m.setLatLng([espMarker.lat,  espMarker.lng])
    })
  }

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
  updateIcon(espMarker: ESPMarker) {
    const markersArr = this.getNativeMarker(espMarker);

    markersArr.forEach((m) => {
      m.setIcon(this.createMarkerIcon(espMarker))
    })
  }
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


  createMarkerIcon(marker: ESPMarker) {
    return L.icon({
      iconUrl: marker.iconUrl,
      iconSize: marker.iconSize,
      iconAnchor: [marker.iconSize[0] / 2, marker.iconSize[1] / 2]
    })
  }

  getNativeMarker(marker: ESPMarker) {
    return this._markers[marker._id];
  }
}
