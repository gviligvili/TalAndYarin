import {Target} from './target.interface';

export interface Cluster {
  ammo: string;
  name: string;
  targets: Target[];
}
