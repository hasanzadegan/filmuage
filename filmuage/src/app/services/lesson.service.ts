import {Injectable} from '@angular/core';
import {ILesson} from '../Model/interface/ILesson';
import {Lesson} from '../Model/Lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor() {
  }

  getLessonList(): ILesson[] {
    //todo get from url
    let lessonList: ILesson[] = [
      {uuid: 'uuid1', title: 'greeting', phraseList: [], quizList: []}
    ]
    return lessonList;
  }

  loadLesson(lessonUUID: string): Lesson {
    // todo fetch from url
    let lesson: ILesson = {
      uuid: 'uuid1',
      title: 'greeting',
      phraseList: [
        {uuid: 'uuid1', text: 'how are you my friend?', translate: 'دوست من چطوری؟', movie: 'url1'},
        {uuid: 'uuid2', text: 'how are you my friend?', translate: 'دوست من چطوری؟', movie: 'url2'},
        {
          uuid: 'uuid3', text: 'what are you doing?', translate: 'چیکار میکنی؟', movie: 'url3',
          wrongs: ['what are you going', 'what are you done?', 'what you doing?']
        },
      ],
      quizList: [
        {phraseUUID: 'uuid1', type: 'intro'},
        {phraseUUID: 'uuid2', type: 'blank'},
        {phraseUUID: 'uuid3', type: 'order'},
        {phraseUUID: 'uuid3', type: 'speech'},
        {phraseUUID: 'uuid2', type: 'multi'},
      ]
    }

    let myLesson: Lesson = new Lesson(lesson);
    return myLesson;
  }
}
