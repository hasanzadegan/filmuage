import {Quizlet} from '../Quizlet';
import {IQuiz} from '../../interface/IQuiz';
export class Intro extends Quizlet {
    constructor(quiz:IQuiz){
        super(quiz);
        super.words = quiz.phrase?.text.replace('?',' ?').split(' ')||[] ;
    }
}
