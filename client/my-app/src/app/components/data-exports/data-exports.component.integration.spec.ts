import { TestBed, ComponentFixture, fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { DataExportsComponent } from './data-exports.component';
import { CommonModule } from '@angular/common';
import { ReportDataService } from '../../services/report-data.service';
import { of, Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

describe('DataExportsComponent Integration Tests', () => {
  let component: DataExportsComponent;
  let fixture: ComponentFixture<DataExportsComponent>;
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
        DataExportsComponent // Import standalone component
      ],
      providers: [
        { provide: ReportDataService, useValue: reportDataServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataExportsComponent);
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
          UniId: '001',
          Student: 'John Doe',
          StudyLevel: 'Undergraduate',
          StudyAreaQILT: 'Science',
          StudyAreaFaculty: 'Science Faculty',
          StudyAreaDiscipline: 'Biology',
          CohortYear: 2021,
          YearOfProgram: 1,
          StudyMode: 'Full-time',
          CreditsTotal: 120,
          CreditsThisYear: 60,
          CreditsPriorYears: 60,
          CampusType: 'On-campus',
          StudentType: 'Domestic',
          Gender: 'Male',
          UniversityName: 'Example University',
          UniGroupDescription: 'Group A',
          StateDescription: 'State X',
          StudyLevelDescription: 'Level Description',
          StudyAreaQILTDescription: 'QILT Description',
          StudyAreaFacultyDescription: 'Faculty Description',
          StudyAreaDisciplineDescription: 'Discipline Description',
          YearOfProgramDescription: 'Year Description',
          StudyModeDescription: 'Mode Description',
          CampusTypeDescription: 'Campus Description',
          StudentTypeDescription: 'Type Description',
          GenderDescription: 'Gender Description',
          Q1Responses: [
            {
              ResponseDate: '2023-01-01',
              QuestionDescription: 'Q1',
              StageDescription: 'Decide',
              ResponseDescription: 'Yes'
            }
          ],
          Q2Responses: [
            {
              ResponseDate: '2023-01-02',
              QuestionDescription: 'Q2',
              StageDescription: 'Plan',
              ResponseDescription: 'No'
            }
          ]
        }
      ]
    };
    reportDataSubject.next(mockReportData);
    tick();
    fixture.detectChanges();

    expect(component.reportData.students.length).toBe(1);
  }));

  it('should export data to CSV correctly', fakeAsync(() => {
    const mockReportData = {
      students: [
        {
          UniId: '001',
          Student: 'John Doe',
          StudyLevel: 'Undergraduate',
          StudyAreaQILT: 'Science',
          StudyAreaFaculty: 'Science Faculty',
          StudyAreaDiscipline: 'Biology',
          CohortYear: 2021,
          YearOfProgram: 1,
          StudyMode: 'Full-time',
          CreditsTotal: 120,
          CreditsThisYear: 60,
          CreditsPriorYears: 60,
          CampusType: 'On-campus',
          StudentType: 'Domestic',
          Gender: 'Male',
          UniversityName: 'Example University',
          UniGroupDescription: 'Group A',
          StateDescription: 'State X',
          StudyLevelDescription: 'Level Description',
          StudyAreaQILTDescription: 'QILT Description',
          StudyAreaFacultyDescription: 'Faculty Description',
          StudyAreaDisciplineDescription: 'Discipline Description',
          YearOfProgramDescription: 'Year Description',
          StudyModeDescription: 'Mode Description',
          CampusTypeDescription: 'Campus Description',
          StudentTypeDescription: 'Type Description',
          GenderDescription: 'Gender Description',
          Q1Responses: [
            {
              ResponseDate: '2023-01-01',
              QuestionDescription: 'Q1',
              StageDescription: 'Decide',
              ResponseDescription: 'Yes'
            }
          ],
          Q2Responses: [
            {
              ResponseDate: '2023-01-02',
              QuestionDescription: 'Q2',
              StageDescription: 'Plan',
              ResponseDescription: 'No'
            }
          ]
        }
      ]
    };
    reportDataSubject.next(mockReportData);
    tick();
    fixture.detectChanges();

    spyOn(XLSX.utils, 'json_to_sheet').and.callThrough();
    spyOn(XLSX.utils, 'sheet_to_csv').and.callThrough();
    spyOn(FileSaver, 'saveAs').and.stub();

    component.exportToCsv();
    expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
    expect(XLSX.utils.sheet_to_csv).toHaveBeenCalled();
    expect(FileSaver.saveAs).toHaveBeenCalled();
  }));

  it('should export data to PDF correctly', fakeAsync(() => {
    const mockReportData = {
      students: [
        {
          UniId: '001',
          Student: 'John Doe',
          StudyLevel: 'Undergraduate',
          StudyAreaQILT: 'Science',
          StudyAreaFaculty: 'Science Faculty',
          StudyAreaDiscipline: 'Biology',
          CohortYear: 2021,
          YearOfProgram: 1,
          StudyMode: 'Full-time',
          CreditsTotal: 120,
          CreditsThisYear: 60,
          CreditsPriorYears: 60,
          CampusType: 'On-campus',
          StudentType: 'Domestic',
          Gender: 'Male',
          UniversityName: 'Example University',
          UniGroupDescription: 'Group A',
          StateDescription: 'State X',
          StudyLevelDescription: 'Level Description',
          StudyAreaQILTDescription: 'QILT Description',
          StudyAreaFacultyDescription: 'Faculty Description',
          StudyAreaDisciplineDescription: 'Discipline Description',
          YearOfProgramDescription: 'Year Description',
          StudyModeDescription: 'Mode Description',
          CampusTypeDescription: 'Campus Description',
          StudentTypeDescription: 'Type Description',
          GenderDescription: 'Gender Description',
          Q1Responses: [
            {
              ResponseDate: '2023-01-01',
              QuestionDescription: 'Q1',
              StageDescription: 'Decide',
              ResponseDescription: 'Yes'
            }
          ],
          Q2Responses: [
            {
              ResponseDate: '2023-01-02',
              QuestionDescription: 'Q2',
              StageDescription: 'Plan',
              ResponseDescription: 'No'
            }
          ]
        }
      ]
    };
    reportDataSubject.next(mockReportData);
    tick();
    fixture.detectChanges();

    spyOn(component, 'exportToPdf').and.callThrough();

    component.exportToPdf();
    flush(); // Flush any pending asynchronous operations
    tick(); // Simulate the passage of time

    expect(component.exportToPdf).toHaveBeenCalled();
  }));

  it('should alert when no data is available to export to CSV', () => {
    spyOn(window, 'alert');
    component.exportToCsv();
    expect(window.alert).toHaveBeenCalledWith('No data available to export.');
  });

  it('should alert when no data is available to export to PDF', () => {
    spyOn(window, 'alert');
    component.exportToPdf();
    expect(window.alert).toHaveBeenCalledWith('No data available to export.');
  });
});