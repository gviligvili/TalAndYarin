import {Component, OnInit, AfterViewInit, ViewChild, OnDestroy} from '@angular/core';
import {TargetService} from './services/targets-service/target.service';
import {Target} from './interfaces/target.interface';
import {AgmMap} from '@agm/core';
import {ESPMarkerService} from './services/espmarker-service/espmarker.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TargetService]
})
export class AppComponent implements OnDestroy, AfterViewInit {

  @ViewChild(AgmMap) agmMap;

  initialLat = 32.073350;
  initialLon = 34.785941;
  filteredTargets: Target[];

  clusterColorMap;
  filterTargetsSub;

  constructor(private targetService: TargetService, private espMarkerService: ESPMarkerService) {
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
    // Change background layer
    this.agmMap.mapReady.subscribe(map => {
      const osmMapType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
          console.log(coord, zoom);
          return 'http://tile.openstreetmap.org/' +
            zoom + '/' + coord.x + '/' + coord.y + '.png';
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        alt: 'OpenStreetMap',
        name: 'OSM',
        maxZoom: 19
      });

      map.mapTypes.set('OSM', osmMapType);
      map.setMapTypeId('OSM');
    });
  }


  getMarkerIcon(father_id: string) {
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
