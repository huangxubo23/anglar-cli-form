import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../common/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ AuthService ]
})
export class HeaderComponent implements OnInit {
  public isAuthenticated: Function;
  constructor(
    private router: Router,
    private authService: AuthService) { 

    }

  ngOnInit() {
    this.isAuthenticated = () => {
      return this.authService.isAuthenticated();
    }
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['home']);
  }
}
