import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Injector, Component } from '@angular/core';

describe('LoginComponent Integration Tests', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'reports-menu', component: DummyComponent }]),
        FormsModule,
        LoginComponent // Import LoginComponent as it is standalone
      ],
      providers: [Injector]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /reports-menu on successful login', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.login({ username: 'admin', password: 'admin' });
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/reports-menu']);
  }));

  it('should show alert on incorrect username or password', () => {
    spyOn(window, 'alert');
    component.login({ username: 'wrong', password: 'credentials' });
    expect(window.alert).toHaveBeenCalledWith('Incorrect username or password');
  });

  it('should log error on navigation failure', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(false));
    spyOn(console, 'error');
    component.login({ username: 'admin', password: 'admin' });
    tick();
    expect(console.error).toHaveBeenCalledWith('Navigation failure, no routes matched.');
  }));

  it('should catch and log navigation error', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(Promise.reject('Navigation error'));
    spyOn(console, 'error');
    component.login({ username: 'admin', password: 'admin' });
    tick();
    expect(console.error).toHaveBeenCalledWith('Navigation error:', 'Navigation error');
  }));
});

@Component({
  template: ''
})
class DummyComponent {}
