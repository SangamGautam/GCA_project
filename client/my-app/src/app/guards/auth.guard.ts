import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ReportFilterService } from '../services/report-filter.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private reportFilterService: ReportFilterService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.reportFilterService.isFiltersApplied().pipe(
      take(1),
      map(applied => {
        console.log('AuthGuard check, filters applied:', applied);
        if (applied) {
          return true;
        } else {
          alert('Please apply filters before proceeding.');
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }
}
