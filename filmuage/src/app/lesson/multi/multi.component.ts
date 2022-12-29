import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-multi',
  templateUrl: './multi.component.html',
  styleUrls: ['./multi.component.scss']
})
export class MultiComponent implements OnInit {
  public quizlet: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.quizlet = router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
  }

}
