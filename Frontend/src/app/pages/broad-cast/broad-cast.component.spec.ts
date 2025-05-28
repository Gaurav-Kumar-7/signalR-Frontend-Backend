import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadCastComponent } from './broad-cast.component';

describe('BroadCastComponent', () => {
  let component: BroadCastComponent;
  let fixture: ComponentFixture<BroadCastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BroadCastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BroadCastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
