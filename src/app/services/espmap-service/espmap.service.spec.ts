import { TestBed, inject } from '@angular/core/testing';

import { EspmapService } from './espmap.service';

describe('EspmapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EspmapService]
    });
  });

  it('should be created', inject([EspmapService], (service: EspmapService) => {
    expect(service).toBeTruthy();
  }));
});
