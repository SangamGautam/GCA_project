import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { DataAnalysisReportsComponent } from './data-analysis-reports.component';
import { ReportDataService } from '../../services/report-data.service';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js';
import { ElementRef } from '@angular/core';

describe('DataAnalysisReportsComponent Unit Tests', () => {
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process report data correctly', () => {
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

    const processedData = component.processReportData(inputData);

    expect(processedData.careerStagesByYear.length).toBe(2);
    expect(processedData.q1Responses.length).toBe(2);
    expect(processedData.q1Responses[0].response).toBe('Yes');
    expect(processedData.q1Responses[1].response).toBe('No');
  });

  it('should calculate percentages correctly', () => {
    const result = component.calculatePercentage(5, 20);
    expect(result).toBe('25.0%');
  });

  it('should categorize years correctly', () => {
    const currentYear = new Date().getFullYear();

    expect(component.getYearCategory(currentYear)).toBe('1st Yr');
    expect(component.getYearCategory(currentYear - 1)).toBe('2nd Yr');
    expect(component.getYearCategory(currentYear - 2)).toBe('3rd Yr');
    expect(component.getYearCategory(currentYear - 3)).toBe('Other');
  });
});
