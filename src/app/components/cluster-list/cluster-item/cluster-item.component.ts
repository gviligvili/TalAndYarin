import {Component, Input} from '@angular/core';
import {Cluster} from '../../../interfaces/cluster.interface';
import {trigger, style, transition, animate} from '@angular/animations';
import {ESPMarkerService} from '../../../services/espmarker-service/espmarker.service';
import {ESPMapService} from '../../../services/espmap-service/espmap.service';

@Component({
  selector: 'cluster-item',
  templateUrl: './cluster-item.component.html',
  styleUrls: ['./cluster-item.component.scss'],
  animations: [
    trigger('targetListDownFade', [
      transition(':enter', [
        style({
          transform: 'translate3d(0, -20%, 0)',
          opacity: 0
        }),
        animate(100, style({
          transform: 'translate3d(0, 0%, 0)',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        style({
          transform: 'translate3d(0, 0, 0)',
          opacity: 1
        }),
        animate(100, style({
          transform: 'translate3d(0, -20%, 0)',
          opacity: 0
        }))]),
    ]),
  ]
})
export class ClusterItemComponent {

  @Input() cluster: Cluster;
  showTargets = false;
  chosenClusters;

  constructor(private espMarkerService: ESPMarkerService, private espMapService: ESPMapService) {
    this.chosenClusters = espMarkerService.getClutserColorMap$().getValue();
  }

  toggleTargets() {
    this.showTargets = !this.showTargets;
  }

  goToCluster(e) {
    this.stopClickPropogation(e);
    const centroid = this.espMapService.calculateCentroid(this.cluster.targets);
    this.espMapService.setCenter(centroid.lat, centroid.lon);
    this.espMapService.setZoom(13);
  }

  checkBoxToggle(e) {
    const isChecked = e.target.checked;

    if (isChecked) {
      // register for marker with father cluster name
      this.espMarkerService.registerCluster(this.cluster.name);
      e.target.checked = !!this.chosenClusters[this.cluster.name];
    } else {
      this.espMarkerService.unregisterCluster(this.cluster.name);
    }
  }

  stopClickPropogation(e) {
    e.stopPropagation();
  }
}
