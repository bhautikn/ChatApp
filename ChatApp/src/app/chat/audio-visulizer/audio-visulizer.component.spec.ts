import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioVisulizerComponent } from './audio-visulizer.component';

describe('AudioVisulizerComponent', () => {
  let component: AudioVisulizerComponent;
  let fixture: ComponentFixture<AudioVisulizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioVisulizerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudioVisulizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
