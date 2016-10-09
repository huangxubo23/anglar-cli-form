import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Statics
import 'rxjs/add/observable/throw';
// Operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class HomeService {
  baseUrl: string;
  constructor(private http: Http) {
    this.baseUrl = 'http://localhost:5000'
  }

  getUserDetail(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/user?userId=${userId}`)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
      });
  }
}
