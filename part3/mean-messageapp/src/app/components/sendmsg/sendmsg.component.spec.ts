import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendmsgComponent } from './sendmsg.component';

describe('SendmsgComponent', () => {
  let component: SendmsgComponent;
  let fixture: ComponentFixture<SendmsgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendmsgComponent]
    });
    fixture = TestBed.createComponent(SendmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
