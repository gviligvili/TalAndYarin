/**
 * Created by 1 on 7/16/2017.
 */
import {EventEmitter} from '@angular/core';

export interface ESPMarker {
  _id: string;
  lat: number;
  lng: number;
  label?: string;
  iconUrl: string;
  iconSize: any;
  markerClick: EventEmitter<any>;
}
