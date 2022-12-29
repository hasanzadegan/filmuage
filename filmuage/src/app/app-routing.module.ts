import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LessonComponent} from './lesson/lesson.component';
import {FilmComponent} from './film/film.component';

const routes: Routes = [
  { path: '', component: FilmComponent},
  { path: 'lesson', component: LessonComponent,
    loadChildren: () => import('./lesson/lesson.module').then(m => m.LessonModule),
  },
  // { path: 'lesson/:lessonUUID', component: LessonComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
