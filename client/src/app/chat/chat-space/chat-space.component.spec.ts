import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSpaceComponent } from './chat-space.component';

describe('ChatSpaceComponent', () => {
  let component: ChatSpaceComponent;
  let fixture: ComponentFixture<ChatSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
