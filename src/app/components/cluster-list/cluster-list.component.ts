import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef, QueryList, ContentChildren,
  ViewChildren
} from '@angular/core';
import {Cluster} from '../../interfaces/cluster.interface';
import {TargetService} from '../../services/targets-service/target.service';
import {ESPMarkerService} from '../../services/espmarker-service/espmarker.service';
import {ESPMapService} from '../../services/espmap-service/espmap.service';
import {PerfectScrollbarComponent} from "angular2-perfect-scrollbar";
import {ClusterItemComponent} from "./cluster-item/cluster-item.component";

@Component({
  selector: 'cluster-list',
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.scss']
})
export class ClusterListComponent implements OnInit, OnDestroy {

  @ViewChild(PerfectScrollbarComponent) scrollbar: PerfectScrollbarComponent;

  clusters: Cluster[];
  showUnchosenMarkers: boolean;
  bindedKeydownEventHandler = this.keydownEventHandler.bind(this);

  constructor(private targetService: TargetService, private espMarkerService: ESPMarkerService,
              private espMapService: ESPMapService, private elementRef: ElementRef) {
    this.espMarkerService.getShowUnchosenMarkers$().subscribe((flag) => {
      this.showUnchosenMarkers = flag;
    });

    this.targetService.getClusters$().subscribe((newClusters) => {
      this.clusters = newClusters;
    });
  }

  ngOnInit() {
    window.addEventListener('keydown', this.bindedKeydownEventHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.bindedKeydownEventHandler);
  }

  keydownEventHandler(e) {
    const LEFT_ARROW_KEYCODE = 37;
    const RIGHT_ARROW_KEYCODE = 39;
    const UP_ARROW_KEYCODE = 38;
    const DOWN_ARROW_KEYCODE = 40;

    if (e.keyCode === LEFT_ARROW_KEYCODE || e.keyCode === DOWN_ARROW_KEYCODE) {
      this.next();
    } else if (e.keyCode === RIGHT_ARROW_KEYCODE || e.keyCode === UP_ARROW_KEYCODE) {
      this.back();
    }
  }

  showAllClusters(e) {
    const isChecked = e.target.checked;

    this.espMarkerService.setShowUnchosenMarkers(isChecked);
  }

  stopCheckboxPropogation(e) {
    e.stopPropagation();
  }

  next() {
    const chosenClustersNames: string[] =
      Object.keys(this.espMarkerService.getClutserColorMap$().getValue());

    // Unless ONLY 1 cluster is chosen, select the first cluster only.
    if (chosenClustersNames.length !== 1) {
      chosenClustersNames.forEach( name => this.espMarkerService.unregisterCluster(name) );

      if (this.clusters[0]) {
        this.espMarkerService.registerCluster(this.clusters[0].name);

        // Also fly to new cluster
        this.espMapService.flyToCluster(this.clusters[0].targets);
        this.scrollbar.scrollTo(0);
      }
    } else {
      const currentClusterName = chosenClustersNames[0];
      const currentClusterIndex = this.clusters.findIndex( x => x.name === currentClusterName);
      const nextClusterIndex = (currentClusterIndex + 1) % (this.clusters.length);
      const nextClusterName = this.clusters[nextClusterIndex].name;

      this.espMarkerService.unregisterCluster(currentClusterName);
      this.espMarkerService.registerCluster(nextClusterName);

      // Also fly to new cluster
      this.espMapService.flyToCluster(this.clusters[nextClusterIndex].targets);
      const newTop = this.elementRef.nativeElement.querySelectorAll('cluster-item')[nextClusterIndex].offsetTop;
      // Scrolling to that element with a little buffer abouve.
      this.scrollbar.scrollTo(newTop - 100);
    }
  }

  back() {
    const chosenClustersNames: string[] =
      Object.keys(this.espMarkerService.getClutserColorMap$().getValue());

    // Unless ONLY 1 cluster is chosen, select the first cluster only.
    if (chosenClustersNames.length !== 1) {
      chosenClustersNames.forEach( name => this.espMarkerService.unregisterCluster(name) );

      if (this.clusters[0]) {
        this.espMarkerService.registerCluster(this.clusters[0].name);

        // Also fly to new cluster
        this.espMapService.flyToCluster(this.clusters[0].targets);
        this.scrollbar.scrollTo(0);
      }
    } else {
      const currentClusterName = chosenClustersNames[0];
      const currentClusterIndex = this.clusters.findIndex( x => x.name === currentClusterName);
      const nextClusterIndex = ((currentClusterIndex + - 1) + this.clusters.length) % (this.clusters.length);
      const nextClusterName = this.clusters[nextClusterIndex].name;

      this.espMarkerService.unregisterCluster(currentClusterName);
      this.espMarkerService.registerCluster(nextClusterName);

      // Also fly to new cluster
      this.espMapService.flyToCluster(this.clusters[nextClusterIndex].targets);
      const newTop = this.elementRef.nativeElement.querySelectorAll('cluster-item')[nextClusterIndex].offsetTop;
      // Scrolling to that element with a little buffer abouve.
      this.scrollbar.scrollTo(newTop - 100);
    }
  }
}
