import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ReportsMenuComponent } from './reports-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { ReportFilterService } from '../../services/report-filter.service';
import { ReportDataService } from '../../services/report-data.service';
import { FilterOptions } from '../../services/filter.model';

describe('ReportsMenuComponent Integration Tests', () => {
  let component: ReportsMenuComponent;
  let fixture: ComponentFixture<ReportsMenuComponent>;
  let router: Router;
  let reportService: jasmine.SpyObj<ReportService>;
  let reportFilterService: jasmine.SpyObj<ReportFilterService>;
  let reportDataService: jasmine.SpyObj<ReportDataService>;
  let currentFiltersSubject: Subject<FilterOptions | null>;

  beforeEach(async () => {
    currentFiltersSubject = new Subject<FilterOptions | null>();
    const reportServiceSpy = jasmine.createSpyObj('ReportService', ['getReports']);
    const reportFilterServiceSpy = jasmine.createSpyObj('ReportFilterService', ['applyFilters'], {
      currentFilters: currentFiltersSubject.asObservable()
    });
    const reportDataServiceSpy = jasmine.createSpyObj('ReportDataService', ['setReportData']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ReportsMenuComponent // Import standalone component
      ],
      providers: [
        { provide: ReportService, useValue: reportServiceSpy },
        { provide: ReportFilterService, useValue: reportFilterServiceSpy },
        { provide: ReportDataService, useValue: reportDataServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsMenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    reportService = TestBed.inject(ReportService) as jasmine.SpyObj<ReportService>;
    reportFilterService = TestBed.inject(ReportFilterService) as jasmine.SpyObj<ReportFilterService>;
    reportDataService = TestBed.inject(ReportDataService) as jasmine.SpyObj<ReportDataService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch reports when filters are applied', fakeAsync(() => {
    const mockReports = [{ id: 1, name: 'Report 1' }];
    reportService.getReports.and.returnValue(of(mockReports));
    currentFiltersSubject.next({ studyLevel: ['Level 1'] } as FilterOptions);
    tick();
    expect(component.reports).toEqual(mockReports);
    expect(reportDataService.setReportData).toHaveBeenCalledWith(mockReports);
  }));

  it('should handle error when fetching reports', fakeAsync(() => {
    reportService.getReports.and.returnValue(throwError('Error fetching reports'));
    spyOn(console, 'error');
    currentFiltersSubject.next({ studyLevel: ['Level 1'] } as FilterOptions);
    tick();
    expect(component.reports).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error while fetching reports:', 'Error fetching reports');
  }));

  it('should navigate to the dashboard if filters are applied', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.filters = { studyLevel: ['Level 1'] } as FilterOptions;
    component.navigateToDashboard('/dashboard');
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should show apply filter dialog if no filters are applied', () => {
    spyOn(window, 'alert');
    component.filters = {} as FilterOptions;
    component.navigateToDashboard('/dashboard');
    expect(window.alert).toHaveBeenCalledWith('Please apply filters before navigating to the dashboard.');
  });

  it('should unsubscribe from filter changes on destroy', () => {
    spyOn(component['filtersAppliedSub'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['filtersAppliedSub'].unsubscribe).toHaveBeenCalled();
  });
});
