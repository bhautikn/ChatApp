import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GIFComponent } from './gif.component';

describe('GIFComponent', () => {
  let component: GIFComponent;
  let fixture: ComponentFixture<GIFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GIFComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GIFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
