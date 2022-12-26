import {Quizlet} from './quizlet/Quizlet';
import {IPhrase} from './interface/IPhrase';
import {Intro} from './quizlet/type/Intro';
import {Speech} from './quizlet/type/Speech';
import {Blank} from './quizlet/type/Blank';
import {Multi} from './quizlet/type/Multi';
import {ILesson} from './interface/ILesson';
import {Order} from './quizlet/type/Order';

export class Lesson {
  private _current: number = 0;
  protected _quizlet: Quizlet | undefined;
  protected _quizletList: Quizlet[] = [];
  private _uuid: string = '';

  constructor(public lesson: ILesson
  ) {
    this._uuid = this.lesson.uuid;

    const getPhrase = (phraseUUID: string): IPhrase => {
      let pharseList: IPhrase[] = this.lesson.phraseList.filter(phrase => {
        if (phrase.uuid === phraseUUID)
          return phrase;
        else
          return null;
      });
      if (pharseList.length === 0)
        throw phraseUUID + ' not found in lesson.quizList';
      else
        return pharseList[0];
    };

    this.lesson.quizList.forEach(quiz => {
      quiz.phrase = getPhrase(quiz.phraseUUID);
      if (quiz.type === 'blank') {
        let quizlet = new Blank(quiz);
        this.add(quizlet);
      }
      if (quiz.type === 'intro') {
        let quizlet = new Intro(quiz);
        this.add(quizlet);
      }
      if (quiz.type === 'multi') {
        let quizlet = new Multi(quiz);
        this.add(quizlet);
      }
      if (quiz.type === 'order') {
        let quizlet = new Order(quiz);
        this.add(quizlet);
      }
      if (quiz.type === 'speech') {
        let quizlet = new Speech(quiz);
        this.add(quizlet);
      }

    })
  }

  public get current(): number {
    return this._current + 1;
  }

  public get uuid() {
    return this._uuid;
  }

  get quizlet() {
    this._quizlet = this.quizletList[this._current];
    return this._quizlet;
  }

  public add(quizlet: any): void {
    this._quizletList.push(quizlet);
  }

  get quizletList() {
    return this._quizletList;
  }

  get quizList() {
    return this.lesson.quizList;
  }

  get total() {
    return this.lesson.quizList.length;
  }

  get id() {
    return this._current;
  }


  next() {
    if (this._current < this.lesson.quizList.length - 1)
      this._current += 1;
    this._quizlet = this.quizletList[this._current];
    return this.quizlet;
  }

  pervious() {
    if (this._current > 0)
      this._current -= 1;
  }
}
