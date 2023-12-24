import { TestBed } from '@angular/core/testing';

import { ChattingSoketService } from './chatting-soket.service';

describe('ChattingSoketService', () => {
  let service: ChattingSoketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChattingSoketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
