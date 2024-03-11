import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackNevigationComponent } from './back-nevigation.component';

describe('BackNevigationComponent', () => {
  let component: BackNevigationComponent;
  let fixture: ComponentFixture<BackNevigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BackNevigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BackNevigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
