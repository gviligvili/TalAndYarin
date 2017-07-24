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
  markersLayer = new L.FeatureGroup();

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
    this.mymap = L.map('mapid').setView([this.initialLat, this.initialLon], 13);
    this.assistantmap = L.map('assistantmap').setView([this.initialLat, this.initialLon], 13);

    this.espMapService.registerMaps(this.mymap, this.assistantmap);
    this.espMapService.addLayer(this.markersLayer);
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
    this.markersLayer.clearLayers();

    // Create a marker for each target and add it to the markers layer.
    targets.forEach(
      target => this.markersLayer.addLayer(
                L.marker([target.lat, target.lon])
                 .setIcon(L.icon({ iconUrl: this.getMarkerIcon(target.father_id) }))
                 .on('click', () => this.markerClicked(target.father_id)))
    );
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
