import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class HomeService {
  baseUrl: string;
  constructor(private http: Http) {
    this.baseUrl = 'http://localhost:5000'
  }

  getUserDetail(userId: string) {
    return this.http.get(`${this.baseUrl}/api/user?userId=${userId}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(response: Response) {
    let body = response.json();
    return body.data || {};
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
