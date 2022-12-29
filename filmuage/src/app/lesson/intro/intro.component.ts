import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Quizlet} from '../../Model/quizlet/Quizlet';
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit  {
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
