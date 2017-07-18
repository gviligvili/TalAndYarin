import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {TargetService} from './services/targets-service/target.service';
import {Target} from './interfaces/target.interface';
import {AgmMap} from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TargetService]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Espek';
  initialLat = 32.073350;
  initialLon = 34.785941;
  targets: Target[];
  chosenMO;

  constructor(private targetService: TargetService) {
    setTimeout(() => {
      $('#startup-spinner').fadeOut(600, () => {
        $('#startup-spinner').remove();
      });
    }, 600);
  }

  ngOnInit(): void {
    this.getTargets();
  }

  @ViewChild(AgmMap) agmMap;
  ngAfterViewInit(): void {
    // Change background layer
    this.agmMap.mapReady.subscribe(map => {
      const osmMapType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
          console.log(coord, zoom);
          return "http://tile.openstreetmap.org/" +
            zoom + "/" + coord.x + "/" + coord.y + ".png";
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        alt: "OpenStreetMap",
        name: "OSM",
        maxZoom: 19
      });

      map.mapTypes.set('OSM', osmMapType);
      map.setMapTypeId('OSM');
    });
  }

  getTargets(): void {
    this.targetService.getTargets().then((targets) => {
      this.targets = targets;
    });
    // this.targets = this.targetService.TEST_TARGETS;
  }

  clickedMarker(FatherId: string) {
    this.chosenMO = FatherId;
    console.log(`clicked the marker: ${FatherId}`);
  }

  mapClicked($event: MouseEvent) {
    console.log('lat: ', $event['coords'].lat, 'lon:', $event['coords'].lng);
  }
}
