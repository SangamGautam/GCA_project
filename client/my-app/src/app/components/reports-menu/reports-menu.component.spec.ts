import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { ReportsMenuComponent } from './reports-menu.component';
import { ReportService } from '../../services/report.service';
import { ReportDataService } from '../../services/report-data.service';
import { ReportFilterService } from '../../services/report-filter.service';
import { FilterOptions } from '../../services/filter.model';

describe('ReportsMenuComponent Unit Tests', () => {
  let component: ReportsMenuComponent;
  let fixture: ComponentFixture<ReportsMenuComponent>;
  let reportServiceMock: any;
  let reportDataServiceMock: any;
  let filterServiceMock: any;
  let routerMock: any;
  let currentFiltersSubject: Subject<FilterOptions | null>;

  beforeEach(async () => {
    reportServiceMock = jasmine.createSpyObj('ReportService', ['getReports']);
    reportServiceMock.getReports.and.returnValue(of([])); // Mock getReports to return an observable
    reportDataServiceMock = jasmine.createSpyObj('ReportDataService', ['setReportData']);
    currentFiltersSubject = new Subject<FilterOptions | null>();
    filterServiceMock = {
      currentFilters: currentFiltersSubject.asObservable(),
      applyFilters: jasmine.createSpy('applyFilters')
    };
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReportsMenuComponent],
      providers: [
        { provide: ReportService, useValue: reportServiceMock },
        { provide: ReportDataService, useValue: reportDataServiceMock },
        { provide: ReportFilterService, useValue: filterServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize filters and subscribe to filter changes', () => {
    const filters: FilterOptions = {
      studyLevel: ['Undergraduate'],
      studentTypes: ['Full-time'],
      studyAreas: ['Science'],
      yearOfProgram: ['1'],
      studyMode: ['On-campus'],
      campusType: ['Main']
    };

    // Emit filters to the subject
    currentFiltersSubject.next(filters);
    fixture.detectChanges();

    // Verify that the filters have been updated in the component
    expect(component.filters).toEqual(filters);

    // Verify that the fetchReports method was called with the correct filters
    expect(reportServiceMock.getReports).toHaveBeenCalledWith(filters);
  });

  it('should fetch reports when filters are applied', () => {
    const reportsData = [{ id: 1, name: 'Report 1' }];
    reportServiceMock.getReports.and.returnValue(of(reportsData)); // Mock getReports to return the reportsData observable

    component.filters = {
      studyLevel: ['Undergraduate'],
      studentTypes: ['Full-time'],
      studyAreas: ['Science'],
      yearOfProgram: ['1'],
      studyMode: ['On-campus'],
      campusType: ['Main']
    };

    component.fetchReports();

    expect(reportServiceMock.getReports).toHaveBeenCalledWith(component.filters);
    expect(component.reports).toEqual(reportsData);
    expect(reportDataServiceMock.setReportData).toHaveBeenCalledWith(reportsData);
  });

  it('should handle error when fetching reports', () => {
    const error = 'Error fetching reports';
    spyOn(console, 'error');
    reportServiceMock.getReports.and.returnValue(throwError(error));

    component.fetchReports();

    expect(console.error).toHaveBeenCalledWith('Error while fetching reports:', error);
  });

  it('should navigate to the dashboard if filters are applied', () => {
    component.filters.studyLevel = ['Undergraduate'];

    component.navigateToDashboard('/dashboard');

    expect(filterServiceMock.applyFilters).toHaveBeenCalledWith(component.filters);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show apply filter dialog if no filters are applied', () => {
    spyOn(window, 'alert');

    component.navigateToDashboard('/dashboard');

    expect(window.alert).toHaveBeenCalledWith('Please apply filters before navigating to the dashboard.');
  });

  it('should unsubscribe from filter changes on destroy', () => {
    const unsubscribeSpy = spyOn(component['filtersAppliedSub'], 'unsubscribe').and.callThrough();

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});