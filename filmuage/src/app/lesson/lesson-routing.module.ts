import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LessonComponent} from './lesson.component';
import {BlankComponent} from './blank/blank.component';
import {OrderComponent} from './order/order.component';
import {MultiComponent} from './multi/multi.component';
import {SpeechComponent} from './speech/speech.component';
import {IntroComponent} from './intro/intro.component';


const routes: Routes = [
  { path: 'blank/:uuid', component: BlankComponent},
  { path: 'intro/:uuid', component: IntroComponent},
  { path: 'speech/:uuid', component: SpeechComponent},
  { path: 'multi/:uuid', component: MultiComponent},
  { path: 'order/:uuid', component: OrderComponent},
  { path: '?id=:uuid', component: LessonComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LessonRoutingModule { }
