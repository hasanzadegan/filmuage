import {Component, OnInit} from '@angular/core';
import {Lesson} from '../Model/Lesson';
import {Quizlet} from '../Model/quizlet/Quizlet';
import {LessonService} from '../services/lesson.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit {
  public uuid: string = '';
  public lesson: Lesson | undefined;
  public quizlet: Quizlet | undefined;


  constructor(
    private lessonService: LessonService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((param: any) => {
      this.uuid = param.id
      this.lesson = this.lessonService.loadLesson(this.uuid);
      this.quizlet = this.lesson.quizlet;
      this.loadQuiz(this.quizlet);
    })
  }

  ngOnInit(): void {

  }

  loadQuiz(quizlet: Quizlet) {
    this.uuid = quizlet.quiz.phraseUUID;
    this.router.navigateByUrl('/lesson/' + quizlet.quiz.type + '/' + this.uuid + '/' + Math.random(), {state: quizlet} );
  }

  goNext() {
    this.lesson?.next();
    this.quizlet = this.lesson?.quizlet;

    if (this.quizlet)
      this.loadQuiz(this.quizlet);
  }

  goPrevious() {
    this.lesson?.pervious();
    this.quizlet = this.lesson?.quizlet;
    if (this.quizlet)
      this.loadQuiz(this.quizlet);
  }
}
