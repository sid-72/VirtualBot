import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AngularFireModule} from "@angular/fire/compat";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {HttpClientModule} from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBfvdS1yhETSR3q0vdxooS1-JDLG6NN7dU",
      authDomain: "virtualbot-e5bfa.firebaseapp.com",
      projectId: "virtualbot-e5bfa",
      storageBucket: "virtualbot-e5bfa.appspot.com",
      messagingSenderId: "602641846681",
      appId: "1:602641846681:web:58fb9388951a771e304308",
      measurementId: "G-QXBJWCFY44"
      }, "cloud"),
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
