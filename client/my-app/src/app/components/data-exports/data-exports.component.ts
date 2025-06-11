import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDataService } from '../../services/report-data.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface StudentData {
  UniId: any;
  Student: any;
  StudyLevel: any;
  StudyAreaQILT: any;
  StudyAreaFaculty: any;
  StudyAreaDiscipline: any;
  CohortYear: any;
  YearOfProgram: any;
  StudyMode: any;
  CreditsTotal: any;
  CreditsThisYear: any;
  CreditsPriorYears: any;
  CampusType: any;
  StudentType: any;
  Gender: any;
  UniversityName: any;
  UniGroupDescription: any;
  StateDescription: any;
  StudyLevelDescription: any;
  StudyAreaQILTDescription: any;
  StudyAreaFacultyDescription: any;
  StudyAreaDisciplineDescription: any;
  YearOfProgramDescription: any;
  StudyModeDescription: any;
  CampusTypeDescription: any;
  StudentTypeDescription: any;
  GenderDescription: any;
  [key: string]: any; // Allows for dynamic properties
}

@Component({
  selector: 'app-data-exports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-exports.component.html',
  styleUrls: ['./data-exports.component.css']
})
export class DataExportsComponent implements OnInit {
  reportData: any = { students: [] };

  constructor(private reportDataService: ReportDataService) {}

  ngOnInit() {
    this.reportDataService.reportData$.subscribe({
      next: (data) => {
        this.reportData = this.processReportData(data);
        console.log("Data received for export:", this.reportData);
      },
      error: (error) => console.error('Error receiving data:', error)
    });
  }

  processReportData(data: any): any {
    const students: StudentData[] = [];

    data.students.forEach((student: any) => {
      const studentData: StudentData = {
        UniId: student.UniId,
        Student: student.Student,
        StudyLevel: student.StudyLevel,
        StudyAreaQILT: student.StudyAreaQILT,
        StudyAreaFaculty: student.StudyAreaFaculty,
        StudyAreaDiscipline: student.StudyAreaDiscipline,
        CohortYear: student.CohortYear,
        YearOfProgram: student.YearOfProgram,
        StudyMode: student.StudyMode,
        CreditsTotal: student.CreditsTotal,
        CreditsThisYear: student.CreditsThisYear,
        CreditsPriorYears: student.CreditsPriorYears,
        CampusType: student.CampusType,
        StudentType: student.StudentType,
        Gender: student.Gender,
        UniversityName: student.UniversityName,
        UniGroupDescription: student.UniGroupDescription,
        StateDescription: student.StateDescription,
        StudyLevelDescription: student.StudyLevelDescription,
        StudyAreaQILTDescription: student.StudyAreaQILTDescription,
        StudyAreaFacultyDescription: student.StudyAreaFacultyDescription,
        StudyAreaDisciplineDescription: student.StudyAreaDisciplineDescription,
        YearOfProgramDescription: student.YearOfProgramDescription,
        StudyModeDescription: student.StudyModeDescription,
        CampusTypeDescription: student.CampusTypeDescription,
        StudentTypeDescription: student.StudentTypeDescription,
        GenderDescription: student.GenderDescription
      };

      student.Q1Responses.forEach((response: any, index: number) => {
        studentData[`Q1_${index + 1}_ResponseDate`] = response.ResponseDate;
        studentData[`Q1_${index + 1}_QuestionDescription`] = response.QuestionDescription;
        studentData[`Q1_${index + 1}_StageDescription`] = response.StageDescription;
        studentData[`Q1_${index + 1}_ResponseDescription`] = response.ResponseDescription;
      });

      student.Q2Responses.forEach((response: any, index: number) => {
        studentData[`Q2_${index + 1}_ResponseDate`] = response.ResponseDate;
        studentData[`Q2_${index + 1}_QuestionDescription`] = response.QuestionDescription;
        studentData[`Q2_${index + 1}_StageDescription`] = response.StageDescription;
        studentData[`Q2_${index + 1}_ResponseDescription`] = response.ResponseDescription;
      });

      students.push(studentData);
    });

    return { students };
  }

  exportToCsv() {
    if (this.reportData.students.length === 0) {
      alert('No data available to export.');
      return;
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportData.students);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const data: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(data, 'report-data.csv');
  }

  exportToPdf() {
    if (this.reportData.students.length === 0) {
      alert('No data available to export.');
      return;
    }
  
    const doc = new jsPDF('l', 'mm', 'a4');
    const tableData = this.reportData.students.map((student: StudentData) => {
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
      ...Object.keys(this.reportData.students[0]).filter(key => key.startsWith('Q1_') || key.startsWith('Q2_'))
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
  }
}