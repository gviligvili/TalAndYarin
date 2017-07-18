import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ESPMarkerService {

  private availableColors = [1, 2, 3, 4, 5, 6, 7];
  private _clutserColorMap = {};
  private showUnchosenMarkers$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private clusterColorMap$: BehaviorSubject<any> = new BehaviorSubject<any>(this._clutserColorMap);

  /**
   * Assigns a color from the available colors
   * to the cluster color hashmap, and remove the color from the
   * available colors.
   * @param clusterID
   * @returns A promise, whether if the color assign was successful or not.
   */
  registerCluster(clusterID: string) {
      // If the cluster already registered, don't do anything.
      if (this._clutserColorMap[clusterID]) {
        return;
      }

      // if there is any color left, assign it to the cluster.
      if (this.availableColors[0]) {
        const color = this.availableColors.shift();
        this._clutserColorMap[clusterID] = color;
        this.clusterColorMap$.next(this._clutserColorMap);
      } else {
        alert('אי אפשר לבחור יותר משבעה צבירים');
        console.error('You can\'t pick more then 7 clusters !');
      }
  }

  /**
   * Remove a color which was assigned to a cluster.
   * and put it back in the available colors.
   * @param clusterID
   */
  unregisterCluster(clusterID: string) {
    const color = this._clutserColorMap[clusterID];
    this.availableColors.unshift(color);
    delete this._clutserColorMap[clusterID];
    this.clusterColorMap$.next(this._clutserColorMap);
  }

  getClutserColorMap$() {
    return this.clusterColorMap$;
  }

  setShowUnchosenMarkers(flag: boolean) {
    this.showUnchosenMarkers$.next(flag);
  }

  getShowUnchosenMarkers$(): BehaviorSubject<boolean> {
    return this.showUnchosenMarkers$;
  }
}
