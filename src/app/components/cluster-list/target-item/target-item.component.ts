import {Component, Input} from '@angular/core';
import {Target} from '../../../interfaces/target.interface';
import {ESPMapService} from '../../../services/espmap-service/espmap.service';

@Component({
  selector: 'target-item',
  templateUrl: './target-item.component.html',
  styleUrls: ['./target-item.component.scss']
})
export class TargetItemComponent {

  @Input() target: Target;

  constructor(private espMapService: ESPMapService) {}

  goToTarget(e) {
    this.stopClickPropogation(e);
    this.espMapService.flyToPoint(this.target.lat, this.target.lon);
  }

  stopClickPropogation(e) {
    e.stopPropagation();
  }
}
