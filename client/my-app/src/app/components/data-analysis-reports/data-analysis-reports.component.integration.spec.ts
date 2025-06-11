import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { DataAnalysisReportsComponent } from './data-analysis-reports.component';
import { ReportDataService } from '../../services/report-data.service';
import { CommonModule } from '@angular/common';
import { ElementRef } from '@angular/core';

describe('DataAnalysisReportsComponent Integration Tests', () => {
  let component: DataAnalysisReportsComponent;
  let fixture: ComponentFixture<DataAnalysisReportsComponent>;
  let mockReportDataService: jasmine.SpyObj<ReportDataService>;
  let reportDataSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    reportDataSubject = new BehaviorSubject<any>({ students: [] });

    const reportDataServiceSpy = jasmine.createSpyObj('ReportDataService', [], {
      reportData$: reportDataSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [CommonModule, DataAnalysisReportsComponent],
      providers: [
        { provide: ReportDataService, useValue: reportDataServiceSpy }
      ]
    }).compileComponents();

    mockReportDataService = TestBed.inject(ReportDataService) as jasmine.SpyObj<ReportDataService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAnalysisReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and subscribe to report data', fakeAsync(() => {
    const mockReportData = {
      students: [
        {
          CohortYear: 2021,
          Q1Responses: [
            { StageDescription: 'Decide', ResponseDescription: 'Yes' }
          ]
        },
        {
          CohortYear: 2022,
          Q1Responses: [
            { StageDescription: 'Plan', ResponseDescription: 'No' }
          ]
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

    expect(component.data.careerStagesByYear.length).toBeGreaterThan(0);
    expect(component.data.q1Responses.length).toBeGreaterThan(0);
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
    expect(component.data.careerStagesByYear.length).toBe(0);
    expect(component.data.q1Responses.length).toBe(0);
  }));

  it('should create Q1 response chart', () => {
    const inputData = [
      {
        CohortYear: 2021,
        Q1Responses: [
          { StageDescription: 'Decide', ResponseDescription: 'Yes' }
        ]
      },
      {
        CohortYear: 2022,
        Q1Responses: [
          { StageDescription: 'Plan', ResponseDescription: 'No' }
        ]
      }
    ];

    component.data = component.processReportData(inputData);

    // Create a mock canvas element
    const canvas = document.createElement('canvas');
    component.q1ResponseChartRef = { nativeElement: canvas } as ElementRef;

    component.createQ1ResponseChart();

    expect(component.q1ResponseChart).toBeDefined();
    expect(component.q1ResponseChart.data.labels.length).toBe(2);
    expect(component.q1ResponseChart.data.labels).toEqual(['Yes', 'No']);
    expect(component.q1ResponseChart.data.datasets[0].data).toEqual([1, 1]);
  });

  it('should destroy existing chart before creating a new one', () => {
    const inputData = [
      {
        CohortYear: 2021,
        Q1Responses: [
          { StageDescription: 'Decide', ResponseDescription: 'Yes' }
        ]
      },
      {
        CohortYear: 2022,
        Q1Responses: [
          { StageDescription: 'Plan', ResponseDescription: 'No' }
        ]
      }
    ];

    component.data = component.processReportData(inputData);

    // Create a mock canvas element
    const canvas = document.createElement('canvas');
    component.q1ResponseChartRef = { nativeElement: canvas } as ElementRef;

    // Create initial chart
    component.createQ1ResponseChart();
    const initialChart = component.q1ResponseChart;

    // Spy on the destroy method
    spyOn(initialChart, 'destroy').and.callThrough();

    // Create new chart and check if the previous one was destroyed
    component.createQ1ResponseChart();
    expect(initialChart).not.toBe(component.q1ResponseChart);
    expect(initialChart.destroy).toHaveBeenCalled();
  });
});
