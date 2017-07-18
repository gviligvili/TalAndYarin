import { TestBed, inject } from '@angular/core/testing';

import { ESPMarkerService } from './espmarker.service';

describe('ESPMarkerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ESPMarkerService]
    });
  });

  it('should be created', inject([ESPMarkerService], (service: ESPMarkerService) => {
    expect(service).toBeTruthy();
  }));
});
