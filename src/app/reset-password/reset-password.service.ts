import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Statics
import 'rxjs/add/observable/throw';
// Operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ResetPasswordUser } from './reset-password';

@Injectable()
export class ResetPasswordService {
  baseUrl: string;
  constructor(private http: Http) {
    this.baseUrl = 'http://localhost:5000';
  }

  resetPassword(user: ResetPasswordUser): Observable<any> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('id_token')
    });
    const options = new RequestOptions({
      headers: headers
    });

    return this.http.put(`${this.baseUrl}/auth/resetPassword`, user, options)
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }
}
