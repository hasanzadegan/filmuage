import {IPhrase} from './IPhrase';
import {IQuiz} from './IQuiz';

export interface ILesson {
    uuid:string;
    title:string;
    phraseList:IPhrase[],
    quizList:IQuiz[]

}
