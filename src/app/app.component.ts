import {Component, AfterViewInit} from '@angular/core';
import {TargetService} from './services/targets-service/target.service';
import {Target} from './interfaces/target.interface';
import {ESPMarkerService} from './services/espmarker-service/espmarker.service';
import {ESPMapService} from './services/espmap-service/espmap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TargetService]
})
export class AppComponent implements AfterViewInit {
  initialLat = 32.073350;
  initialLon = 34.785941;
  filteredTargets: Target[];

  clusterColorMap;
  mymap;
  assistantmap;
  headingsLayer = new L.FeatureGroup();

  constructor(private targetService: TargetService, private espMarkerService: ESPMarkerService, private espMapService: ESPMapService) {
    setTimeout(() => {
      $('#startup-spinner').fadeOut(600, () => {
        $('#startup-spinner').remove();
      });
    }, 600);

    this.targetService.getFilteredTargets$().subscribe((targets) => {
      this.filteredTargets = targets;
      this.updateMarkers(this.filteredTargets);
    });

    this.clusterColorMap = this.espMarkerService.getClutserColorMap$().getValue();
  }

  ngAfterViewInit(): void {
    this.mymap = L.map('mapid', {
      renderer: L.canvas()
    }).setView([this.initialLat, this.initialLon], 13);
    this.assistantmap = L.map('assistantmap', {
      renderer: L.canvas()
    }).setView([this.initialLat, this.initialLon], 13);

    this.espMapService.registerMaps(this.mymap, this.assistantmap);
    // this.espMapService.addLayer(this.markersLayer);
    this.espMapService.addLayer(this.headingsLayer);
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
    this.headingsLayer.clearLayers();

    // Create a marker for each target and add it to the markers layer.
    targets.forEach(
      target => {

        // If heading exists and it's a number.
        if (target.heading && !Number.isNaN(Number(target.heading))) {
          const distance = 0.010;
          const heading = Number(target.heading);
          const planeHeadingDegreeConst = 180;

          const latlngs = [
            {lat: target.lat, lng: target.lon},
            {
              lat: target.lat + distance * Math.cos(heading + planeHeadingDegreeConst),
              lng: target.lon + distance * Math.sin(heading + planeHeadingDegreeConst)
            },
          ];


          var polylineOptions = {
            color: 'blue',
            weight: 4,
            opacity: 0.7
          };

          this.headingsLayer.addLayer(
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
    console.log('lat: ', $event['coords'].lat, 'lon:', $event['coords'].lng);
  }
}
