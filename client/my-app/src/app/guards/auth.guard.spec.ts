// import { TestBed } from '@angular/core/testing';
// import { CanActivateFn } from '@angular/router';

// import { AuthGuard } from './auth.guard';

// describe('AuthGuard', () => {
//   const executeGuard: CanActivateFn = (...guardParameters) => 
//       TestBed.runInInjectionContext(() => AuthGuard(...guardParameters));

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });

//   it('should be created', () => {
//     expect(executeGuard).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ReportFilterService } from '../services/report-filter.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let reportFilterService: jasmine.SpyObj<ReportFilterService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const reportFilterServiceSpy = jasmine.createSpyObj('ReportFilterService', ['isFiltersApplied']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: ReportFilterService, useValue: reportFilterServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    reportFilterService = TestBed.inject(ReportFilterService) as jasmine.SpyObj<ReportFilterService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow navigation if filters are applied', (done: DoneFn) => {
    reportFilterService.isFiltersApplied.and.returnValue(of(true));

    authGuard.canActivate().subscribe(result => {
      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to home page if filters are not applied', (done: DoneFn) => {
    reportFilterService.isFiltersApplied.and.returnValue(of(false));

    authGuard.canActivate().subscribe(result => {
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });
});
