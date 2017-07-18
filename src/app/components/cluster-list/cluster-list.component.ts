import { Component } from '@angular/core';
import {Cluster} from '../../interfaces/cluster.interface';
import {TargetService} from "../../services/targets-service/target.service";

@Component({
  selector: 'cluster-list',
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.scss']
})
export class ClusterListComponent {

  clusters: Cluster[] = _.range(80).map((x) => ({ name: x + 'צביר ' , ammo: 'ammo ' + x , targets: []}));

  constructor(private targetService: TargetService){
    this.targetService.getClusters$().subscribe((newClusters) => {
      this.clusters = newClusters;
    });
  }
}
