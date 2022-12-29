import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export class CommonComponent implements OnInit {
  @Input('quizlet') quizlet:any;
  constructor() { }

  ngOnInit(): void {
  }

}
