import {Component, AfterViewInit} from '@angular/core';
import {TargetService} from './services/targets-service/target.service';
import {Target} from './interfaces/target.interface';
import {ESPMarkerService} from './services/espmarker-service/espmarker.service';
import {ESPMapService} from './services/espmap-service/espmap.service';
import {AmatService} from "./services/amats-service/amat.service";
import {Amat} from "./interfaces/amat.interface";
import Consts from "./consts";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  initialLat = 32.073350;
  initialLon = 34.785941;
  filteredTargets: Target[];
  amats: Amat[];

  clusterColorMap;
  mymap;
  assistantmap;
  mHeadingLayer = new L.FeatureGroup();
  aHeadingLayer = new L.FeatureGroup();

  constructor(private targetService: TargetService, private espMarkerService: ESPMarkerService, private espMapService: ESPMapService, private amatService: AmatService) {
    setTimeout(() => {
      $('#startup-spinner').fadeOut(600, () => {
        $('#startup-spinner').remove();
      });
    }, 600);

    this.targetService.getFilteredTargets$().subscribe((targets) => {
      this.filteredTargets = targets;
      this.updateMarkers(this.filteredTargets);
    });

    this.amatService.getAmats$().subscribe((amats) => {

      amats.forEach((amat: Amat) => {

        const bigRadiusOptions = {
          radius: Number(amat.radius_big),
          dashArray: "10, 5",
          color: amat.color,
          fill: false,
        };

        const smallRadiusOptions = {
          radius: Number(amat.radius_small),
          color: amat.color,
          fill: false
        };

        L.circle([amat.lat, amat.lon], smallRadiusOptions).addTo(this.mymap);
        L.circle([amat.lat, amat.lon], bigRadiusOptions).addTo(this.mymap);
        L.circle([amat.lat, amat.lon], smallRadiusOptions).addTo(this.assistantmap);
        L.circle([amat.lat, amat.lon], bigRadiusOptions).addTo(this.assistantmap);
      });
    });

    this.clusterColorMap = this.espMarkerService.getClutserColorMap$().getValue();
  }

  ngAfterViewInit(): void {
    this.mymap = L.map('mapid', {
      renderer: L.canvas()
    }).setView([this.initialLat, this.initialLon], Consts.MAIN_MAP_ZOON);
    this.assistantmap = L.map('assistantmap', {
      renderer: L.canvas(),
    }).setView([this.initialLat, this.initialLon], Consts.ASSIST_MAP_ZOON);

    this.espMapService.registerMaps(this.mymap, this.assistantmap);
    // this.espMapService.addLayer(this.markersLayer);
    this.mHeadingLayer.addTo(this.mymap);
    this.aHeadingLayer.addTo(this.assistantmap);
  }


  getMarkerIcon(father_id: string): string {
    let path = 'assets/marker-icon-';
    if (this.clusterColorMap[father_id]) {
      path += this.clusterColorMap[father_id] + '.svg';
    } else {
      path += '0.svg';
    }

    return path;
  }

  updateMarkers(targets: Target[]) {
    // This is a total recreation. Remove all previous markers first.
    // this.markersLayer.clearLayers();
    this.mHeadingLayer.clearLayers();
    this.aHeadingLayer.clearLayers();

    // Create a marker for each target and add it to the markers layer.
    targets.forEach(
      target => {

        // If heading exists and it's a number.
        if (target.heading && !Number.isNaN(Number(target.heading))) {
          const distance = 0.2;
          const heading = Number(target.heading);
          const azimuthStartDegree = 90;

          // Converting heading to azimuth.
          const alpha = azimuthStartDegree - (heading + 180);

          const latlngs = [
            {lat: target.lat, lng: target.lon},
            {
              lat: target.lat + distance * Math.sin(alpha * Math.PI / 180),
              lng: target.lon + distance * Math.cos(alpha * Math.PI / 180)
            },
          ];


          const polylineOptions = {
            color: 'blue',
            weight: 4,
            opacity: 0.7
          };

          this.mHeadingLayer.addLayer(
            L.polyline(latlngs, polylineOptions)
          );

          this.aHeadingLayer.addLayer(
            L.polyline(latlngs, polylineOptions)
          );
        }
      });

    const self = this;

    // setInterval(function() {
    //   self.filteredTargets.forEach((tar) => {
    //     tar.lat += 0.002;
    //     tar.lon += 0.003;
    //   });
    // }, 2000);

    // setTimeout(function() {
    //   self.filteredTargets = [];
    //   console.log("targets are gone.")
    // }, 20000);
  }

  markerClicked(father_id: string) {
    const clusterColorMap = this.espMarkerService.getClutserColorMap$().getValue();

    // If registered, remove it from the chosen clusters map.
    if (clusterColorMap[father_id]) {
      this.espMarkerService.unregisterCluster(father_id);
    } else {
      // if not registered, sign him up.
      this.espMarkerService.registerCluster(father_id);
    }
  }

  mapClicked($event: MouseEvent) {
    // console.log('lat: ', $event['coords'].lat, 'lon:', $event['coords'].lng);
  }
}
