import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent Unit Tests', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([]),
        LoginComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /reports-menu on successful login', async () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.login({ username: 'admin', password: 'admin' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledWith(['/reports-menu']);
  });

  it('should alert on incorrect username or password', () => {
    spyOn(window, 'alert');
    component.login({ username: 'wrong', password: 'credentials' });
    expect(window.alert).toHaveBeenCalledWith('Incorrect username or password');
  });

  it('should log error on navigation failure', async () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(false));
    spyOn(console, 'error');
    component.login({ username: 'admin', password: 'admin' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(console.error).toHaveBeenCalledWith('Navigation failure, no routes matched.');
  });

  it('should catch and log navigation error', async () => {
    const error = new Error('Navigation error');
    spyOn(router, 'navigate').and.returnValue(Promise.reject(error));
    const consoleErrorSpy = spyOn(console, 'error');
  
    component.login({ username: 'admin', password: 'admin' });
    await fixture.whenStable();
  
    expect(consoleErrorSpy).toHaveBeenCalledWith('Navigation error:', error);
  });
});
