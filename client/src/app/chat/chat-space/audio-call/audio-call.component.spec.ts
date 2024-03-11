import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioCallComponent } from './audio-call.component';

describe('AudioCallComponent', () => {
  let component: AudioCallComponent;
  let fixture: ComponentFixture<AudioCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioCallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudioCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
