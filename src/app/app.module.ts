import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
// import { provideAuth, getAuth } from '@angular/fire/auth';
// import { provideFirestore, getFirestore } from '@angular/fire/firestore';
// import { AngularFireModule } from '@angular/fire/compat'
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HomeComponent } from './components/pages/home/home.component';
import { HeaderComponent } from './components/component/header/header.component';
import { PuzzleBoardComponent } from './components/puzzle-board/puzzle-board.component';
import { WheelSpinnerComponent } from './components/wheel-spinner/wheel-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    PuzzleBoardComponent,
    WheelSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
