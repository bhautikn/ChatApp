import { TestBed } from '@angular/core/testing';

import { ApiChatService } from './api-chat.service';

describe('ApiChatService', () => {
  let service: ApiChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
