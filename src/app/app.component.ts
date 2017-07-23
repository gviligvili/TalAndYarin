import {Component, OnInit, AfterViewInit, ViewChild, OnDestroy} from '@angular/core';
import {TargetService} from './services/targets-service/target.service';
import {Target} from './interfaces/target.interface';
import {ESPMarkerService} from './services/espmarker-service/espmarker.service';
import {Observable} from 'rxjs/Observable';
import {ESPMapService} from './services/espmap-service/espmap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TargetService]
})
export class AppComponent implements OnDestroy, AfterViewInit {
  initialLat = 32.073350;
  initialLon = 34.785941;
  filteredTargets: Target[];

  clusterColorMap;
  filterTargetsSub;
  mymap;
  markersLayer = new L.FeatureGroup();

  constructor(private targetService: TargetService, private espMarkerService: ESPMarkerService, private espMapService: ESPMapService) {
    setTimeout(() => {
      $('#startup-spinner').fadeOut(600, () => {
        $('#startup-spinner').remove();
      });
    }, 600);

    this.clusterColorMap = this.espMarkerService.getClutserColorMap$().getValue();
    this.filterTargetsSub = this.espMarkerService.getClutserColorMap$().asObservable()
      .merge(this.espMarkerService.getShowUnchosenMarkers$().asObservable(), this.targetService.getTargets$().asObservable())
      .subscribe(this.filterAllTargets.bind(this));
  }

  ngAfterViewInit(): void {
    this.mymap = L.map('mapid').setView([this.initialLat, this.initialLon], 13);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mymap);

    this.mymap.addLayer(this.markersLayer);
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


  filterAllTargets() {
    const allTargets = this.targetService.getTargets$().getValue();
    const clusterColorMap = this.espMarkerService.getClutserColorMap$().getValue();
    const isShowUnchosenMarkers = this.espMarkerService.getShowUnchosenMarkers$().getValue();

    // If show all, no filter needed.
    if (isShowUnchosenMarkers) {
      this.filteredTargets = allTargets;
    } else {
      this.filteredTargets = allTargets.filter((tar) => {
        return clusterColorMap[tar.father_id] !== undefined;
      });
    }

    this.updateMarkers(this.filteredTargets);
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

  ngOnDestroy() {
    this.filterTargetsSub.unsubscribe();
  }
}
