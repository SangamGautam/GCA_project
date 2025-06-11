// src/app/services/report-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  private reportDataSubject = new BehaviorSubject<any[]>([]);
  reportData$ = this.reportDataSubject.asObservable();

  setReportData(data: any[]) {
    this.reportDataSubject.next(data);
  }
}