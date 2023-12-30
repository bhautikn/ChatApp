import { TestBed } from '@angular/core/testing';

import { GifApiService } from './gif-api.service';

describe('GifApiService', () => {
  let service: GifApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GifApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
