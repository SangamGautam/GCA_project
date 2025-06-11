import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FilterOptions } from '../services/filter.model'; // Adjust the path as necessary

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = 'http://localhost:3000/api/students'; // API URL

  constructor(private http: HttpClient) {}

  getReports(filters: FilterOptions): Observable<any[]> {
    let params = new HttpParams();
    
    // Construct HttpParams from the provided filters
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key as keyof FilterOptions];
      if (filterValue && filterValue.length > 0) {
        // Join array values into a comma-separated string to send as single query param
        const value = Array.isArray(filterValue) ? filterValue.join(',') : filterValue;
        params = params.set(key, value);
      }
    });

    return this.http.get<any[]>(this.apiUrl, { params })
      .pipe(
        tap(data => console.log("Fetched data:", data)), // Logging fetched data for debugging
        catchError(error => {
          console.error("Error fetching reports:", error);
          return throwError(() => new Error('Error fetching reports')); // Rethrowing with more specific error
        })
      );
  }
}

