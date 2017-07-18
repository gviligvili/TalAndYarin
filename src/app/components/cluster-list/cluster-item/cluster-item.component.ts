import {Component, Input, OnInit} from '@angular/core';
import {Cluster} from "../../../interfaces/cluster.interface";

@Component({
  selector: 'cluster-item',
  templateUrl: './cluster-item.component.html',
  styleUrls: ['./cluster-item.component.scss']
})
export class ClusterItemComponent {

  @Input() cluster: Cluster;
  showTargets = false;

  toggleTargets() {
    this.showTargets = !this.showTargets;
  }
}
