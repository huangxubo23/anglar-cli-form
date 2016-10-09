import { Component, OnInit } from '@angular/core';

import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HomeService]
})
export class HomeComponent implements OnInit {

  constructor(private _homeService: HomeService) { }

  ngOnInit() {
    this._homeService.getUserDetail('57f9b0dca613c93dac31021c').subscribe((user) => {
      console.log(user);
    }, (error) => {
      console.log(error);
    })
  }

}
