import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksComponent } from './marks.component';

describe('MarksComponent', () => {
  let component: MarksComponent;
  let fixture: ComponentFixture<MarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
