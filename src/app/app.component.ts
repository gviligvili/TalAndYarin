import {Component, OnInit} from '@angular/core';
import {TargetService} from './services/targets-service/target.service';
import {Target} from './interfaces/target.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TargetService]
})
export class AppComponent implements OnInit {
  initialLat = 32.073350;
  initialLon = 34.785941;
  targets: Target[];
  chosenMO = '1';

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

  getTargets(): void {
    this.targetService.getTargets().then((targets) => {
      this.targets = targets;
    });
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: MouseEvent) {
    console.log('lat: ', $event['coords'].lat, 'lon:', $event['coords'].lng);
  }
}
