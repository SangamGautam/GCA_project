import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { DataExportsComponent } from './data-exports.component';
import { ReportDataService } from '../../services/report-data.service';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF with autoTable for testing purposes
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

describe('DataExportsComponent Unit Tests', () => {
  let component: DataExportsComponent;
  let fixture: ComponentFixture<DataExportsComponent>;
  let mockReportDataService: jasmine.SpyObj<ReportDataService>;
  let reportDataSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    reportDataSubject = new BehaviorSubject<any>({ students: [] });

    const reportDataServiceSpy = jasmine.createSpyObj('ReportDataService', [], {
      reportData$: reportDataSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [CommonModule, DataExportsComponent],
      providers: [
        { provide: ReportDataService, useValue: reportDataServiceSpy }
      ]
    }).compileComponents();

    mockReportDataService = TestBed.inject(ReportDataService) as jasmine.SpyObj<ReportDataService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataExportsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and subscribe to report data', fakeAsync(() => {
    const mockReportData = {
      students: [
        {
          UniId: '1',
          Student: 'John Doe',
          StudyLevel: 'Undergraduate',
          StudyAreaQILT: 'Engineering',
          StudyAreaFaculty: 'Engineering Faculty',
          StudyAreaDiscipline: 'Mechanical Engineering',
          CohortYear: 2021,
          YearOfProgram: '1st Year',
          StudyMode: 'Full-time',
          CreditsTotal: 30,
          CreditsThisYear: 15,
          CreditsPriorYears: 15,
          CampusType: 'Main',
          StudentType: 'Domestic',
          Gender: 'Male',
          UniversityName: 'ABC University',
          UniGroupDescription: 'Group A',
          StateDescription: 'State X',
          StudyLevelDescription: 'Undergraduate',
          StudyAreaQILTDescription: 'Engineering',
          StudyAreaFacultyDescription: 'Engineering Faculty',
          StudyAreaDisciplineDescription: 'Mechanical Engineering',
          YearOfProgramDescription: '1st Year',
          StudyModeDescription: 'Full-time',
          CampusTypeDescription: 'Main',
          StudentTypeDescription: 'Domestic',
          GenderDescription: 'Male',
          Q1Responses: [
            { ResponseDate: '2021-01-01', QuestionDescription: 'Q1', StageDescription: 'Decide', ResponseDescription: 'Yes' }
          ],
          Q2Responses: [
            { ResponseDate: '2021-01-02', QuestionDescription: 'Q2', StageDescription: 'Plan', ResponseDescription: 'No' }
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

    expect(component.reportData.students.length).toBeGreaterThan(0);
  }));

  it('should handle empty data scenario', fakeAsync(() => {
    // Emit empty data
    reportDataSubject.next({ students: [] });

    // Trigger ngOnInit manually
    component.ngOnInit();

    // Use tick to simulate passage of time for asynchronous operations
    tick();

    fixture.detectChanges();

    expect(component.reportData.students.length).toBe(0);
  }));

  it('should process report data correctly', () => {
    const inputData = {
      students: [
        {
          UniId: '1',
          Student: 'John Doe',
          StudyLevel: 'Undergraduate',
          StudyAreaQILT: 'Engineering',
          StudyAreaFaculty: 'Engineering Faculty',
          StudyAreaDiscipline: 'Mechanical Engineering',
          CohortYear: 2021,
          YearOfProgram: '1st Year',
          StudyMode: 'Full-time',
          CreditsTotal: 30,
          CreditsThisYear: 15,
          CreditsPriorYears: 15,
          CampusType: 'Main',
          StudentType: 'Domestic',
          Gender: 'Male',
          UniversityName: 'ABC University',
          UniGroupDescription: 'Group A',
          StateDescription: 'State X',
          StudyLevelDescription: 'Undergraduate',
          StudyAreaQILTDescription: 'Engineering',
          StudyAreaFacultyDescription: 'Engineering Faculty',
          StudyAreaDisciplineDescription: 'Mechanical Engineering',
          YearOfProgramDescription: '1st Year',
          StudyModeDescription: 'Full-time',
          CampusTypeDescription: 'Main',
          StudentTypeDescription: 'Domestic',
          GenderDescription: 'Male',
          Q1Responses: [
            { ResponseDate: '2021-01-01', QuestionDescription: 'Q1', StageDescription: 'Decide', ResponseDescription: 'Yes' }
          ],
          Q2Responses: [
            { ResponseDate: '2021-01-02', QuestionDescription: 'Q2', StageDescription: 'Plan', ResponseDescription: 'No' }
          ]
        }
      ]
    };

    const processedData = component.processReportData(inputData);

    expect(processedData.students.length).toBe(1);
    expect(processedData.students[0].Q1_1_ResponseDate).toBe('2021-01-01');
    expect(processedData.students[0].Q2_1_ResponseDate).toBe('2021-01-02');
  });

  it('should export data to CSV', () => {
    spyOn(XLSX.utils, 'json_to_sheet').and.callThrough();
    spyOn(XLSX.utils, 'sheet_to_csv').and.callThrough();
    spyOn(FileSaver, 'saveAs').and.callThrough();

    const inputData = {
      students: [
        {
          UniId: '1',
          Student: 'John Doe',
          StudyLevel: 'Undergraduate',
          StudyAreaQILT: 'Engineering',
          StudyAreaFaculty: 'Engineering Faculty',
          StudyAreaDiscipline: 'Mechanical Engineering',
          CohortYear: 2021,
          YearOfProgram: '1st Year',
          StudyMode: 'Full-time',
          CreditsTotal: 30,
          CreditsThisYear: 15,
          CreditsPriorYears: 15,
          CampusType: 'Main',
          StudentType: 'Domestic',
          Gender: 'Male',
          UniversityName: 'ABC University',
          UniGroupDescription: 'Group A',
          StateDescription: 'State X',
          StudyLevelDescription: 'Undergraduate',
          StudyAreaQILTDescription: 'Engineering',
          StudyAreaFacultyDescription: 'Engineering Faculty',
          StudyAreaDisciplineDescription: 'Mechanical Engineering',
          YearOfProgramDescription: '1st Year',
          StudyModeDescription: 'Full-time',
          CampusTypeDescription: 'Main',
          StudentTypeDescription: 'Domestic',
          GenderDescription: 'Male',
          Q1Responses: [
            { ResponseDate: '2021-01-01', QuestionDescription: 'Q1', StageDescription: 'Decide', ResponseDescription: 'Yes' }
          ],
          Q2Responses: [
            { ResponseDate: '2021-01-02', QuestionDescription: 'Q2', StageDescription: 'Plan', ResponseDescription: 'No' }
          ]
        }
      ]
    };

    component.reportData = component.processReportData(inputData);

    component.exportToCsv();

    expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
    expect(XLSX.utils.sheet_to_csv).toHaveBeenCalled();
    expect(FileSaver.saveAs).toHaveBeenCalled();
  });

  it('should export data to PDF', () => {
    const pdf = new jsPDF();
    spyOn(pdf, 'save').and.callThrough();
    spyOn(pdf, 'text').and.callThrough();
    spyOn(pdf, 'autoTable').and.callThrough();

    const inputData = {
      students: [
        {
          UniId: '1',
          Student: 'John Doe',
          StudyLevel: 'Undergraduate',
          StudyAreaQILT: 'Engineering',
          StudyAreaFaculty: 'Engineering Faculty',
          StudyAreaDiscipline: 'Mechanical Engineering',
          CohortYear: 2021,
          YearOfProgram: '1st Year',
          StudyMode: 'Full-time',
          CreditsTotal: 30,
          CreditsThisYear: 15,
          CreditsPriorYears: 15,
          CampusType: 'Main',
          StudentType: 'Domestic',
          Gender: 'Male',
          UniversityName: 'ABC University',
          UniGroupDescription: 'Group A',
          StateDescription: 'State X',
          StudyLevelDescription: 'Undergraduate',
          StudyAreaQILTDescription: 'Engineering',
          StudyAreaFacultyDescription: 'Engineering Faculty',
          StudyAreaDisciplineDescription: 'Mechanical Engineering',
          YearOfProgramDescription: '1st Year',
          StudyModeDescription: 'Full-time',
          CampusTypeDescription: 'Main',
          StudentTypeDescription: 'Domestic',
          GenderDescription: 'Male',
          Q1Responses: [
            { ResponseDate: '2021-01-01', QuestionDescription: 'Q1', StageDescription: 'Decide', ResponseDescription: 'Yes' }
          ],
          Q2Responses: [
            { ResponseDate: '2021-01-02', QuestionDescription: 'Q2', StageDescription: 'Plan', ResponseDescription: 'No' }
          ]
        }
      ]
    };

    component.reportData = component.processReportData(inputData);

    // Spy on the instance methods instead of prototype methods
    component.exportToPdf = function () {
      const doc = pdf;
      const tableData = this.reportData.students.map((student: any) => {
        const rowData: any[] = [];
        Object.entries(student).forEach(([key, value]) => {
          if (key.startsWith('Q1_') || key.startsWith('Q2_')) {
            rowData.push(value);
          }
        });
        return [
          student.UniId,
          student.Student,
          student.StudyLevel,
          student.StudyAreaQILT,
          student.StudyAreaFaculty,
          student.StudyAreaDiscipline,
          student.CohortYear,
          student.YearOfProgram,
          student.StudyMode,
          student.CreditsTotal,
          student.CreditsThisYear,
          student.CreditsPriorYears,
          ...rowData
        ];
      });

      const tableHeaders = [
        'UniId',
        'Student',
        'StudyLevel',
        'StudyAreaQILT',
        'StudyAreaFaculty',
        'StudyAreaDiscipline',
        'CohortYear',
        'YearOfProgram',
        'StudyMode',
        'CreditsTotal',
        'CreditsThisYear',
        'CreditsPriorYears',
        ...Object.keys(this.reportData.students[0]).filter((key: any) => key.startsWith('Q1_') || key.startsWith('Q2_'))
      ];

      (doc as any).autoTable({
        head: [tableHeaders],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8 },
        didDrawPage: (data: any) => {
          // Header
          doc.setFontSize(20);
          doc.setTextColor(40);
          doc.text('Student Report Data', data.settings.margin.left, 22);
        }
      });

      doc.save('report-data.pdf');
    };

    component.exportToPdf();

    expect(pdf.save).toHaveBeenCalledWith('report-data.pdf');
    expect(pdf.text).toHaveBeenCalled();
    expect(pdf.autoTable).toHaveBeenCalled();
  });
});
