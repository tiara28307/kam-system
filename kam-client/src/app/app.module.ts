import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

// layouts
import { UserComponent } from "./layouts/user/user.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// user views
import { CustomerKycDashboardComponent } from "./views/user/dashboards/customer-kyc-dashboard/customer-kyc-dashboard.component";
import { SettingsComponent } from "./views/user/settings/settings.component";
import { TablesComponent } from "./views/user/tables/tables.component";

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/registers/register.component";

// no layouts views
import { IndexComponent } from "./views/index/index.component";
import { LandingComponent } from "./views/landing/landing.component";
import { ProfileComponent } from "./views/profile/profile.component";

// components for views and layouts
import { UserNavbarComponent } from "./components/navbars/user-navbar/user-navbar.component";
import { AuthNavbarComponent } from "./components/navbars/auth-navbar/auth-navbar.component";
import { CardBarChartComponent } from "./components/cards/card-bar-chart/card-bar-chart.component";
import { CardLineChartComponent } from "./components/cards/card-line-chart/card-line-chart.component";
import { CardPageVisitsComponent } from "./components/cards/card-page-visits/card-page-visits.component";
import { CardProfileComponent } from "./components/cards/card-profile/card-profile.component";
import { CardSettingsComponent } from "./components/cards/card-settings/card-settings.component";
import { CardSocialTrafficComponent } from "./components/cards/card-social-traffic/card-social-traffic.component";
import { CardStatsComponent } from "./components/cards/card-stats/card-stats.component";
import { CardTableComponent } from "./components/cards/card-table/card-table.component";
import { FooterUserComponent } from "./components/footers/footer-user/footer-user.component";
import { FooterComponent } from "./components/footers/footer/footer.component";
import { FooterSmallComponent } from "./components/footers/footer-small/footer-small.component";
import { HeaderStatsComponent } from "./components/headers/header-stats/header-stats.component";
import { IndexNavbarComponent } from "./components/navbars/index-navbar/index-navbar.component";
import { MapExampleComponent } from "./components/maps/map-example/map-example.component";
import { IndexDropdownComponent } from "./components/dropdowns/index-dropdown/index-dropdown.component";
import { TableDropdownComponent } from "./components/dropdowns/table-dropdown/table-dropdown.component";
import { PagesDropdownComponent } from "./components/dropdowns/pages-dropdown/pages-dropdown.component";
import { NotificationDropdownComponent } from "./components/dropdowns/notification-dropdown/notification-dropdown.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { UserDropdownComponent } from "./components/dropdowns/user-dropdown/user-dropdown.component";
import { ContactFormComponent } from './views/contact-form/contact-form.component';
import { EmailService } from "./services/email.service";
import { AuthService } from "./auth/auth.service";
import { ForgotPasswordComponent } from './views/auth/forgot-password/forgot-password.component';
import { CardApplicationStatsComponent } from './components/cards/card-application-stats/card-application-stats.component';
import { CardApplicationTableComponent } from "./components/cards/card-application-table/card-application-table.component";
import { CardRequestTableComponent } from './components/cards/card-request-table/card-request-table.component';
import { CardApplicationFullTableComponent } from './components/cards/card-application-full-table/card-application-full-table.component';
import { CardRequestFullTableComponent } from './components/cards/card-request-full-table/card-request-full-table.component';
import { CardApplicationComponent } from './components/cards/card-application/card-application.component';
import { CardRequestComponent } from './components/cards/card-request/card-request.component';
import { HeaderDefaultComponent } from './components/headers/header-default/header-default.component';

@NgModule({
  declarations: [
    AppComponent,
    CardBarChartComponent,
    CardLineChartComponent,
    IndexDropdownComponent,
    PagesDropdownComponent,
    TableDropdownComponent,
    NotificationDropdownComponent,
    UserDropdownComponent,
    SidebarComponent,
    FooterComponent,
    FooterSmallComponent,
    FooterUserComponent,
    CardPageVisitsComponent,
    CardProfileComponent,
    CardSettingsComponent,
    CardSocialTrafficComponent,
    CardStatsComponent,
    CardTableComponent,
    HeaderStatsComponent,
    MapExampleComponent,
    AuthNavbarComponent,
    UserNavbarComponent,
    IndexNavbarComponent,
    UserComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    IndexComponent,
    LandingComponent,
    ProfileComponent,
    ContactFormComponent,
    ForgotPasswordComponent,
    CardApplicationStatsComponent,
    CardApplicationTableComponent,
    CustomerKycDashboardComponent,
    SettingsComponent,
    TablesComponent,
    CardRequestTableComponent,
    CardApplicationFullTableComponent,
    CardRequestFullTableComponent,
    CardApplicationComponent,
    CardRequestComponent,
    HeaderDefaultComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    NgxLoadingModule
  ],
  providers: [EmailService, AuthService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
