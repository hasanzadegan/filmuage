import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.scss']
})
export class SpeechComponent implements OnInit {
  public quizlet: any;

  constructor(private route: ActivatedRoute,
              private router: Router) {
    this.quizlet = router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
  }

}
