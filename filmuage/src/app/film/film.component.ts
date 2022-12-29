import { Component, OnInit } from '@angular/core';
import {ILesson} from '../Model/interface/ILesson';
import {LessonService} from '../services/lesson.service';
import {Router} from '@angular/router';
import {Lesson} from '../Model/Lesson';
import {Quizlet} from '../Model/quizlet/Quizlet';
import {Blank} from '../Model/quizlet/type/Blank';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit {
  public lessonList: ILesson[] = [];

  constructor(
    private lessonService: LessonService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.lessonList = this.lessonService.getLessonList() as ILesson[];
  }

  loadLesson(lessonUUID: string) {
    let myLesson: Lesson = this.lessonService.loadLesson(lessonUUID);
    this.router.navigateByUrl('lesson?id='+lessonUUID, {state: [lessonUUID]})
  }

}
