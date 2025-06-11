import { Component, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private router: Router;

  constructor(private injector: Injector) {
    this.router = this.injector.get(Router);
  }

  async login(credentials: { username: string; password: string }) {
    console.log('Login method called. Attempting to navigate to /reports-menu');
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      try {
        const success = await this.router.navigate(['/reports-menu']);
        console.log('Navigation success:', success);
        if (!success) {
          console.error('Navigation failure, no routes matched.');
        }
      } catch (err) {
        console.error('Navigation error:', err);
      }
    } else {
      alert('Incorrect username or password');
    }
  }
}