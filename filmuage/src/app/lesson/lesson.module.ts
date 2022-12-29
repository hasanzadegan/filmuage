import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonRoutingModule } from './lesson-routing.module';
import {LessonComponent} from './lesson.component';
import { IntroComponent } from './intro/intro.component';
import { OrderComponent } from './order/order.component';
import { SpeechComponent } from './speech/speech.component';
import { MultiComponent } from './multi/multi.component';
import {BlankComponent} from './blank/blank.component';
import { CommonComponent } from './common.component';


@NgModule({
  declarations: [
    LessonComponent,
    IntroComponent,
    OrderComponent,
    SpeechComponent,
    MultiComponent,
    BlankComponent,
    CommonComponent,
  ],
  imports: [
    CommonModule,
    LessonRoutingModule
  ]
})
export class LessonModule { }
