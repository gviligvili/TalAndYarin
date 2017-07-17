import {Component, OnInit} from '@angular/core';
import {TargetService} from './target.service';
import {Target} from './interfaces/target.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TargetService]
})
export class AppComponent implements OnInit {
  title = 'Espek';
  initialLat = 32.073350;
  initialLon = 34.785941;
  targets: Target[];

  constructor(private targetService: TargetService) {}

  ngOnInit(): void {
    this.getTargets();
  }

  getTargets(): void {
    this.targets = this.targetService.getTargets();
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: MouseEvent) {
    console.log('lat: ', $event['coords'].lat, 'lon:', $event['coords'].lng);
  }
}
