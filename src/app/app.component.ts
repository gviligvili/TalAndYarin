import { Component, OnInit } from '@angular/core';

import {TargetService} from './target.service';
import {Target} from './target';

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
}
