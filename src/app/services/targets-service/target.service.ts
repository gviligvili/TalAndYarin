import {Injectable} from '@angular/core';

import {Target} from '../../interfaces/target.interface';
import {Http, Response} from '@angular/http';
import {environment} from '../../../environments/environment';
import {HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Cluster} from '../../interfaces/cluster.interface';
import * as moment from 'moment';
import {ESPMarkerService} from "../espmarker-service/espmarker.service";
import {Observable} from "rxjs";

@Injectable()
export class TargetService {


  targets$: BehaviorSubject<Target[]> = new BehaviorSubject<Target[]>([]);
  clusters$: BehaviorSubject<Cluster[]> = new BehaviorSubject<Cluster[]>([]);
  filteredTargets$: BehaviorSubject<Target[]> = new BehaviorSubject<Target[]>([]);
  filteredClusters$: BehaviorSubject<Cluster[]> = new BehaviorSubject<Cluster[]>([]);
  isFilterByTimeOn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // if Dates of filter changed.
  filterByDate$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  _filterStartDate: number;
  _filterEndDate: number;

  constructor(private http: Http, private espMarkerService: ESPMarkerService) {
    // Everytime Target updates, update clusters.
    this.targets$.subscribe((targets: Target[]) => this.clusters$.next(this.processTargetsToClusters(targets)));
    this.filteredTargets$.subscribe((targets: Target[]) => {
      // Create clusters from filtered targets.
      let clusters = this.processTargetsToClusters(targets);
      // Filter the clusters by filterClusters Logic.
      let filteredClusters = this._filterAllCluster(clusters);
      this.filteredClusters$.next(filteredClusters)
    });

    this.fetchTargets();

    // Here the main app targets filtering accour.
    this.espMarkerService.getClutserColorMap$().asObservable()
      .merge(this.espMarkerService.getShowUnchosenMarkers$().asObservable(), this.getTargets$().asObservable(),
        this.getIsFilterByTimeOn$().asObservable(), this.filterByDate$.asObservable())
      .subscribe(this._filterAllTargets.bind(this));
  }

  getTargets$(): BehaviorSubject<Target[]> {
    return this.targets$;
  }

  getFilteredTargets$(): BehaviorSubject<Target[]> {
    return this.filteredTargets$;
  }


  getClusters$(): Observable<Cluster[]> {
    return this.clusters$;
  }

  getFilteredClusters$(): BehaviorSubject<Cluster[]> {
    return this.filteredClusters$;
  }

  getIsFilterByTimeOn$(): BehaviorSubject<boolean> {
    return this.isFilterByTimeOn$;
  }

  toggleFilterByTime() {
    this.isFilterByTimeOn$.next(!this.isFilterByTimeOn$.getValue());
  }

  getFilterDates() {
    return {startDate: this._filterStartDate, endDate: this._filterEndDate}
  }

  setFilterDates(startDate, endDate) {
    this._filterStartDate = startDate;
    this._filterEndDate = endDate;

    // triggering an update.
    this.filterByDate$.next({});
  }

  fetchTargets() {
    return this.http.get(environment.serverAddress + '/targets').toPromise().then(
      (res: Response) => {
        const data = res.json();

        console.warn('Recieved Targets :', data);
        this.targets$.next(data);
      },
      (error: HttpErrorResponse) => {
        console.error('Couldn\'t fetch targets from server.');
      }
    );
  }

  processTargetsToClusters(targets: Target[]): Cluster[] {
    const clusters: any = {};

    targets.forEach((tar: Target) => {
      // If the cluster doesn't exist.
      if (!clusters[tar.father_id]) {
        clusters[tar.father_id] = {
          ammo: tar.ammo,
          name: tar.father_id,
          targets: new Array<Target>()
        };
      }

      // add the target to the cluster targets;
      clusters[tar.father_id].targets.push(tar);
    });

    // To DELETE !@#@#!@#
    const a = moment().startOf('day').add(1, 'hours');
    _.values(clusters).forEach((c) => {
      c.time = a.valueOf();
      a.add(1, 'hours');
    });

    return _.values(clusters);
  }


  private _filterAllTargets() {
    let totalTargets = this.getTargets$().getValue();
    const clusterColorMap = this.espMarkerService.getClutserColorMap$().getValue();
    const isShowUnchosenMarkers = this.espMarkerService.getShowUnchosenMarkers$().getValue();

    // If show all, no filter needed.
    if (!isShowUnchosenMarkers) {
      totalTargets = totalTargets.filter((tar) => {
        return clusterColorMap[tar.father_id] !== undefined;
      });
    }

    this.filteredTargets$.next(totalTargets);
  }

  private _filterAllCluster(clusters: Cluster[]) {
    const isFilterByDateOn = this.isFilterByTimeOn$.getValue();
    let totalClusters = clusters;

    // If date filter is on, filter by date
    if (isFilterByDateOn && this._filterStartDate && this._filterEndDate) {
      totalClusters = totalClusters.filter((cluster) => {
        return moment(cluster.time).isBetween(this._filterStartDate, this._filterEndDate);
      })
    }

    return totalClusters;
  }
}

