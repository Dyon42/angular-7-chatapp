import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatActiveusersComponent } from './chat-activeusers.component';

describe('ChatActiveusersComponent', () => {
  let component: ChatActiveusersComponent;
  let fixture: ComponentFixture<ChatActiveusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatActiveusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatActiveusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
