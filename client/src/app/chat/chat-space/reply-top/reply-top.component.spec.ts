import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyTopComponent } from './reply-top.component';

describe('ReplyTopComponent', () => {
  let component: ReplyTopComponent;
  let fixture: ComponentFixture<ReplyTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReplyTopComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplyTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
