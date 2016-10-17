import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { Route } from '@angular/router';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { HomeService } from './home/home.service';
import { SignupComponent } from './signup/signup.component';
import { FormMessagesComponent } from './common/form-messages.component';
import { AuthServiceService } from './common/auth-service.service';
import { AuthGuard } from './common/auth-guard';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,            //FormsModule gives us template driven directives such as:ngModel and NgForm
    ReactiveFormsModule,    //ReactiveFormsModule gives us directives like formControl and ngFormGroup
    HttpModule,
    JsonpModule,
    routing
  ],
  declarations: [
    AppComponent,
    FormMessagesComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    ResetPasswordComponent,
    HomeComponent,
    SignupComponent
  ],
  providers: [
    appRoutingProviders,
    HomeService,
    AuthServiceService,
    AuthGuard,
    {
      provide: 'canSignup',
      useValue: () => {
        return localStorage.getItem('id_token') ? false : true;
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
