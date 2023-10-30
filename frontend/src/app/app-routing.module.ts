import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";
import { HomeComponent } from "./pages/home/home.component";
import { BoardListComponent } from "./pages/board/board-list/board-list.component";
import { BoardViewComponent } from "./pages/board/board-view/board-view.component";
import { EmptyLayoutComponent } from "./layouts/empty-layout/empty-layout.component";
import { LoginComponent } from "./pages/login/login.component";
import { SignupComponent } from "./pages/signup/signup.component";

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'board/list', component: BoardListComponent },
      { path: 'board/view/:no', component: BoardViewComponent },
      { path: 'board/:mode', component: BoardViewComponent },
    ]
  },
  {
    path: 'login',
    component: EmptyLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
    ]
  },
  {
    path: 'signup',
    component: EmptyLayoutComponent,
    children: [
      { path: '', component: SignupComponent },
    ]
  },
  { path: 'board', redirectTo: 'board/list', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
