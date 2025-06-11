import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { DatabaseFrequencyReportsComponent } from './database-frequency-reports.component';
import { ReportDataService } from '../../services/report-data.service';
import { CommonModule } from '@angular/common';

describe('DatabaseFrequencyReportsComponent Unit Tests', () => {
  let component: DatabaseFrequencyReportsComponent;
  let fixture: ComponentFixture<DatabaseFrequencyReportsComponent>;
  let mockReportDataService: jasmine.SpyObj<ReportDataService>;
  let reportDataSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    reportDataSubject = new BehaviorSubject<any>([]);

    const reportDataServiceSpy = jasmine.createSpyObj('ReportDataService', [], {
      reportData$: reportDataSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [CommonModule, DatabaseFrequencyReportsComponent], // Import the standalone component
      providers: [
        { provide: ReportDataService, useValue: reportDataServiceSpy }
      ]
    }).compileComponents();

    mockReportDataService = TestBed.inject(ReportDataService) as jasmine.SpyObj<ReportDataService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseFrequencyReportsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and subscribe to report data', fakeAsync(() => {
    const mockReportData = {
      students: [
        {
          CohortYear: 2021,
          Q1Responses: [{ StageDescription: 'Decide' }],
          Q2Responses: [{ StageDescription: 'Plan' }],
          StudyAreaQILTDescription: 'Science'
        },
        {
          CohortYear: 2022,
          Q1Responses: [{ StageDescription: 'Action' }],
          Q2Responses: [],
          StudyAreaQILTDescription: 'Arts'
        }
      ]
    };

    // Emit the mock report data
    reportDataSubject.next(mockReportData);

    // Trigger ngOnInit manually
    component.ngOnInit();

    // Use tick to simulate passage of time for asynchronous operations
    tick();

    fixture.detectChanges();

    expect(component.data.studentsAndResponses.length).toBeGreaterThan(0);
    expect(component.data.careerStages.length).toBeGreaterThan(0);
    expect(component.data.qiltStudyArea.length).toBeGreaterThan(0);
  }));

  it('should handle invalid report data format gracefully', fakeAsync(() => {
    const invalidReportData = { invalid: 'data' };

    // Emit the invalid report data
    reportDataSubject.next(invalidReportData);

    spyOn(console, 'error');

    // Trigger ngOnInit manually
    component.ngOnInit();

    // Use tick to simulate passage of time for asynchronous operations
    tick();

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith('Invalid report data format. Expected an array of students.');
    expect(component.data.studentsAndResponses.length).toBe(0);
    expect(component.data.careerStages.length).toBe(0);
    expect(component.data.qiltStudyArea.length).toBe(0);
  }));

  it('should correctly categorize year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.getYearCategory(currentYear)).toBe('1st Year');
    expect(component.getYearCategory(currentYear - 1)).toBe('2nd Year');
    expect(component.getYearCategory(currentYear - 2)).toBe('3rd Year');
    expect(component.getYearCategory(currentYear - 3)).toBe('Other');
  });

  it('should correctly calculate percentages', () => {
    expect(component.calculatePercentage(50, 100)).toBe('50%');
    expect(component.calculatePercentage(0, 100)).toBe('0%');
    expect(component.calculatePercentage(50, 0)).toBe('0%');
  });

  it('should correctly process report data', () => {
    const reportData = [
      {
        CohortYear: 2021,
        Q1Responses: [{ StageDescription: 'Decide' }],
        Q2Responses: [{ StageDescription: 'Plan' }],
        StudyAreaQILTDescription: 'Science'
      },
      {
        CohortYear: 2022,
        Q1Responses: [{ StageDescription: 'Action' }],
        Q2Responses: [],
        StudyAreaQILTDescription: 'Arts'
      }
    ];

    const processedData = component.processReportData(reportData);

    expect(processedData.studentsAndResponses.length).toBe(2);
    expect(processedData.careerStages.length).toBe(3);
    expect(processedData.qiltStudyArea.length).toBe(2);
  });
});
