import { Component } from '@angular/core';
import {Cluster} from '../../interfaces/cluster.interface';
import {TargetService} from '../../services/targets-service/target.service';
import {ESPMarkerService} from "../../services/espmarker-service/espmarker.service";

@Component({
  selector: 'cluster-list',
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.scss']
})
export class ClusterListComponent {

  clusters: Cluster[];
  showUnchosenMarkers: boolean;

  constructor(private targetService: TargetService, private espMarkerService: ESPMarkerService) {
    this.espMarkerService.getShowUnchosenMarkers$().subscribe((flag) => {
      this.showUnchosenMarkers = flag;
    });

    this.targetService.getClusters$().subscribe((newClusters) => {
      this.clusters = newClusters;
    });
  }

  showAllClusters(e) {
    const isChecked = e.target.checked;

    this.espMarkerService.setShowUnchosenMarkers(isChecked);
  }

  stopCheckboxPropogation(e) {
    e.stopPropagation();
  }
}
