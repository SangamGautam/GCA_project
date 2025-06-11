import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDataService } from '../../services/report-data.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-data-analysis-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-analysis-reports.component.html',
  styleUrls: ['./data-analysis-reports.component.css']
})
export class DataAnalysisReportsComponent implements OnInit {
  @ViewChild('q1ResponseChart', { static: true }) q1ResponseChartRef!: ElementRef;
  q1ResponseChart: any;

  data: any = {
    careerStagesByYear: [],
    q1Responses: []
  };

  constructor(private reportDataService: ReportDataService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.reportDataService.reportData$.subscribe((reportData: any) => {
      if (Array.isArray(reportData.students)) {
        this.data = this.processReportData(reportData.students);
        this.createQ1ResponseChart();
      } else {
        console.error('Invalid report data format. Expected an array of students.');
      }
    });
  }

  processReportData(reportData: any[]): any {
    const careerStagesByYear: any[] = [];
    const q1Responses: any[] = [];

    const yearCategoryTotals: { [key: string]: number } = {};
    const stageYearCounts: { [key: string]: { [key: string]: number } } = {};
    const q1ResponseCounts: { [key: string]: number } = {};

    reportData.forEach(student => {
      const yearCategory = this.getYearCategory(student.CohortYear);
      const q1Stage = student.Q1Responses[0]?.StageDescription;
      const q1Response = student.Q1Responses[0]?.ResponseDescription;

      // Update year category totals
      yearCategoryTotals[yearCategory] = (yearCategoryTotals[yearCategory] || 0) + 1;

      // Update stage counts for each year category
      if (q1Stage) {
        stageYearCounts[yearCategory] = stageYearCounts[yearCategory] || {};
        stageYearCounts[yearCategory][q1Stage] = (stageYearCounts[yearCategory][q1Stage] || 0) + 1;
      }

      // Update Q1 response counts
      if (q1Response) {
        q1ResponseCounts[q1Response] = (q1ResponseCounts[q1Response] || 0) + 1;
      }
    });

    // Populate careerStagesByYear array
    Object.keys(yearCategoryTotals).forEach(yearCategory => {
      const yearData = {
        year: yearCategory,
        decide: this.calculatePercentage(stageYearCounts[yearCategory]?.['Decide'] || 0, yearCategoryTotals[yearCategory]),
        plan: this.calculatePercentage(stageYearCounts[yearCategory]?.['Plan'] || 0, yearCategoryTotals[yearCategory]),
        action: this.calculatePercentage(stageYearCounts[yearCategory]?.['Action'] || 0, yearCategoryTotals[yearCategory]),
        sorted: this.calculatePercentage(stageYearCounts[yearCategory]?.['Sorted'] || 0, yearCategoryTotals[yearCategory])
      };
      careerStagesByYear.push(yearData);
    });

    // Populate q1Responses array
    Object.keys(q1ResponseCounts).forEach(response => {
      q1Responses.push({
        response: response,
        count: q1ResponseCounts[response]
      });
    });

    // Sort q1Responses array in descending order based on count
    q1Responses.sort((a, b) => b.count - a.count);

    return {
      careerStagesByYear,
      q1Responses
    };
  }

  getYearCategory(cohortYear: number): string {
    const currentYear = new Date().getFullYear();
    const yearOfStudy = currentYear - cohortYear + 1;

    if (yearOfStudy === 1) {
      return '1st Yr';
    } else if (yearOfStudy === 2) {
      return '2nd Yr';
    } else if (yearOfStudy === 3) {
      return '3rd Yr';
    } else {
      return 'Other';
    }
  }

  calculatePercentage(count: number, total: number): string {
    if (total === 0) {
      return '0%';
    }
    const percentage = (count / total) * 100;
    return `${percentage.toFixed(1)}%`;
  }

  createQ1ResponseChart() {
    // Destroy the existing chart if it exists
    if (this.q1ResponseChart) {
      this.q1ResponseChart.destroy();
    }

    const labels = this.data.q1Responses.map((item: any) => item.response);
    const data = this.data.q1Responses.map((item: any) => item.count);

    this.q1ResponseChart = new Chart(this.q1ResponseChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}