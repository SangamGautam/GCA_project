import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDataService } from '../../services/report-data.service';

@Component({
  selector: 'app-database-frequency-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './database-frequency-reports.component.html',
  styleUrls: ['./database-frequency-reports.component.css']
})
export class DatabaseFrequencyReportsComponent implements OnInit {
  data: any = {
    studentsAndResponses: [],
    careerStages: [],
    qiltStudyArea: []
  };

  constructor(private reportDataService: ReportDataService) {}

  ngOnInit() {
    this.reportDataService.reportData$.subscribe((reportData: any) => {
      if (Array.isArray(reportData.students)) {
        this.data = this.processReportData(reportData.students);
      } else {
        console.error('Invalid report data format. Expected an array of students.');
      }
    });
  }

  processReportData(reportData: any[]): any {
    const studentsAndResponses: any[] = [];
    const careerStages: any[] = [];
    const qiltStudyArea: any[] = [];

    const yearCategoryTotals: { [key: string]: number } = {};
    const stageYearCounts: { [key: string]: { [key: string]: number } } = {};
    const studyAreaStageCounts: { [key: string]: { [key: string]: number } } = {};

    reportData.forEach(student => {
      const yearCategory = this.getYearCategory(student.CohortYear);
      const q1Stage = student.Q1Responses[0]?.StageDescription;
      const q2Stage = student.Q2Responses[0]?.StageDescription;
      const studyArea = student.StudyAreaQILTDescription;

      // Update year category totals
      yearCategoryTotals[yearCategory] = (yearCategoryTotals[yearCategory] || 0) + 1;

      // Update stage counts for each year category
      if (q1Stage) {
        stageYearCounts[q1Stage] = stageYearCounts[q1Stage] || {};
        stageYearCounts[q1Stage][yearCategory] = (stageYearCounts[q1Stage][yearCategory] || 0) + 1;
      }
      if (q2Stage) {
        stageYearCounts[q2Stage] = stageYearCounts[q2Stage] || {};
        stageYearCounts[q2Stage][yearCategory] = (stageYearCounts[q2Stage][yearCategory] || 0) + 1;
      }

      // Update study area counts for each stage
      if (studyArea) {
        studyAreaStageCounts[studyArea] = studyAreaStageCounts[studyArea] || {};
        if (q1Stage) {
          studyAreaStageCounts[studyArea][q1Stage] = (studyAreaStageCounts[studyArea][q1Stage] || 0) + 1;
        }
        if (q2Stage) {
          studyAreaStageCounts[studyArea][q2Stage] = (studyAreaStageCounts[studyArea][q2Stage] || 0) + 1;
        }
      }
    });

    // Populate studentsAndResponses array
    Object.keys(yearCategoryTotals).forEach(yearCategory => {
      studentsAndResponses.push({
        year: yearCategory,
        students: yearCategoryTotals[yearCategory],
        responses: this.calculatePercentage(yearCategoryTotals[yearCategory], reportData.length)
      });
    });

    // Populate careerStages array
    Object.keys(stageYearCounts).forEach(stage => {
      const stageData = {
        stage: stage,
        firstYear: this.calculatePercentage(stageYearCounts[stage]['1st Year'] || 0, yearCategoryTotals['1st Year'] || 0),
        secondYear: this.calculatePercentage(stageYearCounts[stage]['2nd Year'] || 0, yearCategoryTotals['2nd Year'] || 0),
        thirdYear: this.calculatePercentage(stageYearCounts[stage]['3rd Year'] || 0, yearCategoryTotals['3rd Year'] || 0),
        other: this.calculatePercentage(stageYearCounts[stage]['Other'] || 0, yearCategoryTotals['Other'] || 0)
      };
      careerStages.push(stageData);
    });

    // Populate qiltStudyArea array
    Object.keys(studyAreaStageCounts).forEach(studyArea => {
      const studyAreaData = {
        area: studyArea,
        decide: this.calculatePercentage(studyAreaStageCounts[studyArea]['Decide'] || 0, reportData.length),
        plan: this.calculatePercentage(studyAreaStageCounts[studyArea]['Plan'] || 0, reportData.length),
        action: this.calculatePercentage(studyAreaStageCounts[studyArea]['Action'] || 0, reportData.length),
        sorted: this.calculatePercentage(studyAreaStageCounts[studyArea]['Sorted'] || 0, reportData.length)
      };
      qiltStudyArea.push(studyAreaData);
    });

    return {
      studentsAndResponses,
      careerStages,
      qiltStudyArea
    };
  }

  getYearCategory(cohortYear: number): string {
    const currentYear = new Date().getFullYear();
    const yearOfStudy = currentYear - cohortYear + 1;

    if (yearOfStudy === 1) {
      return '1st Year';
    } else if (yearOfStudy === 2) {
      return '2nd Year';
    } else if (yearOfStudy === 3) {
      return '3rd Year';
    } else {
      return 'Other';
    }
  }

  calculatePercentage(count: number, total: number): string {
    if (total === 0) {
      return '0%';
    }
    const percentage = (count / total) * 100;
    return `${percentage.toFixed(0)}%`;
  }
}