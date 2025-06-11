import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterOptions } from './filter.model'; // Ensure this path is correct

@Injectable({
  providedIn: 'root'
})
export class ReportFilterService {
  private filtersSource = new BehaviorSubject<FilterOptions | null>(null);
  private filtersAppliedSource = new BehaviorSubject<boolean>(false);
  readonly currentFilters: Observable<FilterOptions | null> = this.filtersSource.asObservable();
  readonly filtersApplied: Observable<boolean> = this.filtersAppliedSource.asObservable();

  constructor() {}

  applyFilters(filters: FilterOptions): void {
    this.filtersSource.next(filters);
    this.filtersAppliedSource.next(this.areFiltersApplied(filters));
  }

  clearFilters(): void {
    this.filtersSource.next(null);
    this.filtersAppliedSource.next(false);
  }

  isFiltersApplied(): Observable<boolean> {
    return this.filtersAppliedSource.asObservable();
  }

  public areFiltersApplied(filters: FilterOptions | null): boolean {
    return filters !== null && (
      (filters.studyLevel ?? []).length > 0 ||
      (filters.studentTypes ?? []).length > 0 ||
      (filters.studyAreas ?? []).length > 0 ||
      (filters.yearOfProgram ?? []).length > 0 ||
      (filters.studyMode ?? []).length > 0 ||
      (filters.campusType ?? []).length > 0
    );
  }
}
