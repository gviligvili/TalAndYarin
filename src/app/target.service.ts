import { Injectable } from '@angular/core';

import { Target } from './target';
import { TARGETS } from './mock-targets';

@Injectable()
export class TargetService {
  getTargets(): Target[] {
    return TARGETS;
  }
}
