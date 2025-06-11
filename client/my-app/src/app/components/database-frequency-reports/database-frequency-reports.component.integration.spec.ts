import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DatabaseFrequencyReportsComponent } from './database-frequency-reports.component';
import { CommonModule } from '@angular/common';
import { ReportDataService } from '../../services/report-data.service';
import { of, Subject } from 'rxjs';

describe('DatabaseFrequencyReportsComponent Integration Tests', () => {
  let component: DatabaseFrequencyReportsComponent;
  let fixture: ComponentFixture<DatabaseFrequencyReportsComponent>;
  let reportDataService: jasmine.SpyObj<ReportDataService>;
  let reportDataSubject: Subject<any>;

  beforeEach(async () => {
    reportDataSubject = new Subject<any>();
    const reportDataServiceSpy = jasmine.createSpyObj('ReportDataService', ['reportData$'], {
      reportData$: reportDataSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DatabaseFrequencyReportsComponent // Import standalone component
      ],
      providers: [
        { provide: ReportDataService, useValue: reportDataServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatabaseFrequencyReportsComponent);
    component = fixture.componentInstance;
    reportDataService = TestBed.inject(ReportDataService) as jasmine.SpyObj<ReportDataService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should process and display report data correctly', fakeAsync(() => {
    const mockReportData = {
      students: [
        {
          CohortYear: 2021,
          Q1Responses: [{ StageDescription: 'Decide' }],
          Q2Responses: [{ StageDescription: 'Plan' }],
          StudyAreaQILTDescription: 'Science'
        }
      ]
    };
    reportDataSubject.next(mockReportData);
    tick();
    fixture.detectChanges();

    expect(component.data.studentsAndResponses.length).toBe(1);
    expect(component.data.careerStages.length).toBe(2); // 'Decide' and 'Plan'
    expect(component.data.qiltStudyArea.length).toBe(1);
  }));

  it('should handle invalid report data format gracefully', fakeAsync(() => {
    spyOn(console, 'error');
    const invalidReportData = { students: 'invalid data format' };
    reportDataSubject.next(invalidReportData);
    tick();
    fixture.detectChanges();

    expect(component.data.studentsAndResponses.length).toBe(0);
    expect(component.data.careerStages.length).toBe(0);
    expect(component.data.qiltStudyArea.length).toBe(0);
    expect(console.error).toHaveBeenCalledWith('Invalid report data format. Expected an array of students.');
  }));
});
