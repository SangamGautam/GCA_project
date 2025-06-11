import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { ReportDataService } from '../../services/report-data.service';
import { FilterOptions } from '../../services/filter.model';
import { ReportFilterService } from '../../services/report-filter.service';

@Component({
  selector: 'app-reports-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './reports-menu.component.html',
  styleUrls: ['./reports-menu.component.css']
})
export class ReportsMenuComponent implements OnInit, OnDestroy {
  filters: FilterOptions = {
    studyLevel: [],
    studentTypes: [],
    studyAreas: [],
    yearOfProgram: [],
    studyMode: [],
    campusType: []
  };
  reports: any[] = [];
  private filtersAppliedSub: Subscription = new Subscription();

  constructor(
    private reportService: ReportService,
    private router: Router,
    private filterService: ReportFilterService,
    private reportDataService: ReportDataService
  ) {}

  ngOnInit() {
    this.filtersAppliedSub = this.filterService.currentFilters.subscribe(filters => {
      if (filters) {
        this.filters = filters;
        this.fetchReports();
      } else {
        this.reports = [];
        console.log("Filters cleared. Reports data reset.");
      }
    });
  }

  fetchReports(): void {
    this.reportService.getReports(this.filters).subscribe(
      (reports) => {
        this.reports = reports;
        this.reportDataService.setReportData(reports);
      },
      (error) => {
        console.error('Error while fetching reports:', error);
      }
    );
  }

  navigateToDashboard(path: string) {
    this.applyFiltersAndNavigate(path);
  }

  applyFiltersAndNavigate(path: string) {
    if (this.isFiltersApplied()) {
      this.filterService.applyFilters(this.filters);
      this.router.navigate([path]);
    } else {
      this.showApplyFilterDialog();
    }
  }

  isFiltersApplied(): boolean {
    return (
      (this.filters.studyLevel?.length ?? 0) > 0 ||
      (this.filters.studentTypes?.length ?? 0) > 0 ||
      (this.filters.studyAreas?.length ?? 0) > 0 ||
      (this.filters.yearOfProgram?.length ?? 0) > 0 ||
      (this.filters.studyMode?.length ?? 0) > 0 ||
      (this.filters.campusType?.length ?? 0) > 0
    );
  }

  showApplyFilterDialog() {
    alert('Please apply filters before navigating to the dashboard.');
  }

  ngOnDestroy() {
    this.filtersAppliedSub.unsubscribe();
  }
}
