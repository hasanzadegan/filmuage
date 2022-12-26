import {IQuiz} from '../interface/IQuiz';
import {IPhrase} from '../interface/IPhrase';

export class Quizlet {
  protected _quiz: IQuiz;
  protected _words: string[] = [];
  protected _phrase?: IPhrase;

  get words() {
    return this._words;
  }

  set words(words: string[]) {
    this._words = words;
  }

  get phrase(){
    return this._phrase;
  }
  constructor(quiz: IQuiz) {
    this._quiz = quiz;
    this._phrase = this._quiz.phrase;
    this._words = this.words;
  }

  public render(): void {

  }

  public get quiz() {
    return this._quiz;
  }

  public getClassName() {
    return this.constructor.name;
  }

}

