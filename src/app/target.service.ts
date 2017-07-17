import { Injectable } from '@angular/core';

import { Target } from './interfaces/target.interface';
import { TARGETS } from './mock-targets';

@Injectable()
export class TargetService {
  getTargets(): Target[] {
    return TARGETS;
  }
}
