import { Component, OnInit } from '@angular/core';

import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.homeService.getUserDetail('57f9b0dca613c93dac31021c').subscribe((user) => {
      console.log(user);
    }, (error) => {
      console.log(error);
    })
  }

}
