import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LessonComponent} from './lesson.component';
import {BlankComponent} from './blank/blank.component';
import {OrderComponent} from './order/order.component';
import {MultiComponent} from './multi/multi.component';
import {SpeechComponent} from './speech/speech.component';
import {IntroComponent} from './intro/intro.component';


const routes: Routes = [
  { path: 'blank/:uuid/:r', component: BlankComponent},
  { path: 'intro/:uuid/:r', component: IntroComponent},
  { path: 'speech/:uuid/:r', component: SpeechComponent},
  { path: 'multi/:uuid/:r', component: MultiComponent},
  { path: 'order/:uuid/:r', component: OrderComponent},
  { path: '?id=:uuid/:r', component: LessonComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LessonRoutingModule { }
