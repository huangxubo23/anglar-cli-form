import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthServiceService {

  constructor(private router: Router) { }

  isAuthenticated() {
    return localStorage.getItem('id_token') ? true : false;
  }
}
