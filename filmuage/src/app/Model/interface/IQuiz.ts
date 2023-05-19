import {IPhrase} from './IPhrase';
import {QuizType} from '../enum/QuizType';

export interface IQuiz {
    phraseUUID: string;
    type: QuizType;
    phrase?:IPhrase;
    blankPlace?:number;
}
