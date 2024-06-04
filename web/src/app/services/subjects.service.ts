import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private apiUrl = '/api/subjects';

  constructor(private http: HttpClient) { }

  getAllSubjects(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  findSubjectById(subjectId: string): Observable<any> {
    const url = `${this.apiUrl}/find/${subjectId}`;
    return this.http.get<any>(url);
  }

  createSubject(subjectName: string): Observable<any> {
    const body = { SubjectName: subjectName };
    return this.http.post<any>(this.apiUrl, body);
  }

  deleteSubject(subjectId: string): Observable<any> {
    const url = `${this.apiUrl}/${subjectId}`;
    return this.http.delete<any>(url);
  }
}
