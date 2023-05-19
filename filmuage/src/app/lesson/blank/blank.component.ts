import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss']
})
export class BlankComponent implements OnInit {
  public quizlet: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.quizlet = router.getCurrentNavigation()?.extras.state;
  }
  ngOnInit(): void {

    let blankStrArr = this.quizlet.words;
    blankStrArr[this.quizlet.quiz.blankPlace] = '___'

    this.quizlet.phrase.text = blankStrArr.join(' ');
    console.log('phrase >>>>> ', this.quizlet.phrase.text);
  }
}
