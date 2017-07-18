import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class ESPMarkerService {

  private availableColors = [1, 2, 3, 4, 5, 6, 7];
  private clutserColorMap = {};
  private showUnchosenMarkers$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Assigns a color from the available colors
   * to the cluster color hashmap, and remove the color from the
   * available colors.
   * @param clusterID
   * @returns A promise, whether if the color assign was successful or not.
   */
  registerCluster(clusterID: string) {
    return new Promise((resolve, reject) => {
      // if there is any color left, assign it to the cluster.
      if (this.availableColors[0]) {
        const color =  this.availableColors.shift();
        this.clutserColorMap[clusterID] = color;
        resolve();
      } else {
          console.error('You can\'t pick more then 7 clusters !');
          reject();
      }
    });
  }

  /**
   * Remove a color which was assigned to a cluster.
   * and put it back in the available colors.
   * @param clusterID
   */
  unregisterCluster(clusterID: string) {
    const color = this.clutserColorMap[clusterID];
    this.availableColors.push(color);
    delete this.clutserColorMap[clusterID];
  }

  setShowUnchosenMarkers(flag: boolean) {
    this.showUnchosenMarkers$.next(flag);
  }

  getShowUnchosenMarkers$(): BehaviorSubject<boolean> {
    return this.showUnchosenMarkers$;
  }
}
