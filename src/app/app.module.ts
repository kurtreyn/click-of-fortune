import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './components/pages/home/home.component';
import { HeaderComponent } from './components/component/header/header.component';
import { PuzzleBoardComponent } from './components/puzzle-board/puzzle-board.component';
import { WheelSpinnerComponent } from './components/wheel-spinner/wheel-spinner.component';
import { CreatePuzzleComponent } from './components/pages/create-puzzle/create-puzzle.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    PuzzleBoardComponent,
    WheelSpinnerComponent,
    CreatePuzzleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
