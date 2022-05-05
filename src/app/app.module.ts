import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule, appRoutingComponents } from './app-routing.module';
import { AppComponent } from "./app.component";
import { AuthGuard } from "./auth/auth.guard";
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SafeHtmlPipe } from './pipes/sanitize.pipe';
import { FormatDatePipe } from './pipes/dateFormat.pipe';
import { AuthService } from "./services/auth/auth.service";
import { ModalComponent } from "./components/content/Modal/modal.component";
import { SearchComponent } from "./components/content/Search/search.component";

@NgModule({
    declarations: [
        AppComponent,
        appRoutingComponents,
        SafeHtmlPipe,
        FormatDatePipe,
        ModalComponent,
        SearchComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgbModule
    ],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, authInterceptorProviders, AuthGuard, AuthService],
    bootstrap: [AppComponent]
})
export class AppModule { }