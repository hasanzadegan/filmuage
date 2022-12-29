import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  public quizlet: any;
  constructor(private route: ActivatedRoute,
              private router: Router) {
    this.quizlet = router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
  }

}
