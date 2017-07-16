import { Component } from '@angular/core';
import {ESPMarker} from './interfaces/ESPMarker.interface';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Espek';
  lat = 32.073350;
  lng = 34.785941;

  markers: ESPMarker[] = [
    {
      lat: 32.073700,
      lng: 34.785241,
      label: 'A',
      draggable: true
    },
    {
      lat: 32.073440,
      lng: 34.785951,
      label: 'B',
      draggable: false
    },
    {
      lat: 32.073150,
      lng: 34.785531,
      label: 'C',
      draggable: true
    }
  ];

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event['coords'].lat,
      lng: $event['coords'].lng,
      draggable: false
    });
  }

  markerDragEnd(marker: ESPMarker, $event: MouseEvent) {
    console.log('dragEnd', marker, $event);
  }
}
