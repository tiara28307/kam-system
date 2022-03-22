import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { NgPipesModule } from 'ngx-pipes';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

// layouts
import { UserComponent } from "./layouts/user/user.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// user views
import { CustomerKycDashboardComponent } from "./views/user/dashboards/customer-kyc-dashboard/customer-kyc-dashboard.component";
import { SettingsComponent } from "./views/user/settings/settings.component";
import { CardDashboardStatsComponent } from './components/cards/card-dashboard-stats/card-dashboard-stats.component';
import { CardApplicationTableComponent } from "./components/cards/card-application-table/card-application-table.component";
import { CardRequestTableComponent } from './components/cards/card-request-table/card-request-table.component';
import { HeaderDefaultComponent } from './components/headers/header-default/header-default.component';
import { CompanyKycDashboardComponent } from './views/user/dashboards/company-kyc-dashboard/company-kyc-dashboard.component';
import { ApplicationsComponent } from './views/user/applications/applications.component';
import { CompanyAmlDashboardComponent } from './views/user/dashboards/company-aml-dashboard/company-aml-dashboard.component';
import { TransactionsComponent } from './views/user/transactions/transactions.component';
import { RequestsComponent } from './views/user/requests/requests.component';
import { ReportsComponent } from './views/user/reports/reports.component';
import { CompanyCaseManagementDashboardComponent } from './views/user/dashboards/company-case-management-dashboard/company-case-management-dashboard.component';
import { CompanySettingsComponent } from './views/user/settings/company-settings/company-settings.component';
import { CustomerSettingsComponent } from './views/user/settings/customer-settings/customer-settings.component';
import { KycSidebarComponent } from './components/sidebars/kyc-sidebar/kyc-sidebar.component';
import { AmlSidebarComponent } from './components/sidebars/aml-sidebar/aml-sidebar.component';
import { CmsSidebarComponent } from './components/sidebars/cms-sidebar/cms-sidebar.component';
import { CardCustomerRequestsComponent } from './components/cards/customer/card-customer-requests/card-customer-requests.component';
import { CardCompanyRequestsComponent } from './components/cards/company/card-company-requests/card-company-requests.component';
import { CardCompanyHistoryComponent } from './components/cards/company/card-company-history/card-company-history.component';
import { CardCustomerHistoryComponent } from './components/cards/customer/card-customer-history/card-customer-history.component';
import { CardCompanySettingsComponent } from './components/cards/company/card-company-settings/card-company-settings.component';
import { CardCustomerSettingsComponent } from './components/cards/customer/card-customer-settings/card-customer-settings.component';
import { HistoryComponent } from './views/user/history/history.component';
import { CardRequestOverviewComponent } from './components/cards/card-request-overview/card-request-overview.component';
import { CardApplicationOverviewComponent } from './components/cards/card-application-overview/card-application-overview.component';

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/register/register.component";
import { ForgotPasswordComponent } from './views/auth/forgot-password/forgot-password.component';

// homepage views
import { IndexComponent } from "./views/index/index.component";
import { ContactFormComponent } from './views/contact-form/contact-form.component';

// generic views and layouts
import { UserNavbarComponent } from "./components/navbars/user-navbar/user-navbar.component";
import { AuthNavbarComponent } from "./components/navbars/auth-navbar/auth-navbar.component";
import { CardBarChartComponent } from "./components/cards/other-may-remove/card-bar-chart/card-bar-chart.component";
import { CardLineChartComponent } from "./components/cards/other-may-remove/card-line-chart/card-line-chart.component";
import { CardPageVisitsComponent } from "./components/cards/other-may-remove/card-page-visits/card-page-visits.component";
import { CardProfileComponent } from "./components/cards/other-may-remove/card-profile/card-profile.component";
import { CardSettingsComponent } from "./components/cards/other-may-remove/card-settings/card-settings.component";
import { CardSocialTrafficComponent } from "./components/cards/other-may-remove/card-social-traffic/card-social-traffic.component";
import { CardStatsComponent } from "./components/cards/other-may-remove/card-stats/card-stats.component";
import { CardTableComponent } from "./components/cards/other-may-remove/card-table/card-table.component";
import { FooterUserComponent } from "./components/footers/footer-user/footer-user.component";
import { FooterComponent } from "./components/footers/footer/footer.component";
import { FooterSmallComponent } from "./components/footers/footer-small/footer-small.component";
import { HeaderStatsComponent } from "./components/headers/header-stats/header-stats.component";
import { IndexNavbarComponent } from "./components/navbars/index-navbar/index-navbar.component";
import { TableDropdownComponent } from "./components/dropdowns/table-dropdown/table-dropdown.component";
import { PagesDropdownComponent } from "./components/dropdowns/pages-dropdown/pages-dropdown.component";
import { NotificationDropdownComponent } from "./components/dropdowns/notification-dropdown/notification-dropdown.component";
import { SidebarComponent } from "./components/sidebars/sidebar.component";
import { UserDropdownComponent } from "./components/dropdowns/user-dropdown/user-dropdown.component";

// services
import { EmailService } from "./services/email.service";
import { AuthService } from "./services/auth.service";
import { RegisterService } from "./services/register.service";
import { CardTransactionTableComponent } from './components/cards/company/card-transaction-table/card-transaction-table.component';
import { CardTransactionOverviewComponent } from './components/cards/company/card-transaction-overview/card-transaction-overview.component';
import { CardReportTableComponent } from './components/cards/company/card-report-table/card-report-table.component';
import { CardReportOverviewComponent } from './components/cards/company/card-report-overview/card-report-overview.component';
import { ReportComponent } from './views/user/reports/report/report.component';
import { ApplicationComponent } from './views/user/applications/application/application.component';
import { TransactionComponent } from './views/user/transactions/transaction/transaction.component';
import { ReviewApplicationComponent } from './views/user/applications/review-application/review-application.component';
import { SelectServiceComponent } from './views/user/select-service/select-service.component';
import { CardServiceComponent } from './components/cards/card-service/card-service.component';
import { AlertsComponent } from './views/user/alerts/alerts.component';

@NgModule({
  declarations: [
    AppComponent,
    CardBarChartComponent,
    CardLineChartComponent,
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
    AuthNavbarComponent,
    UserNavbarComponent,
    IndexNavbarComponent,
    UserComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    IndexComponent,
    ContactFormComponent,
    ForgotPasswordComponent,
    CardDashboardStatsComponent,
    CardApplicationTableComponent,
    CustomerKycDashboardComponent,
    SettingsComponent,
    CardRequestTableComponent,
    HeaderDefaultComponent,
    CompanyKycDashboardComponent,
    ApplicationsComponent,
    CompanyAmlDashboardComponent,
    TransactionsComponent,
    RequestsComponent,
    ReportsComponent,
    CompanyCaseManagementDashboardComponent,
    CompanySettingsComponent,
    CustomerSettingsComponent,
    KycSidebarComponent,
    AmlSidebarComponent,
    CmsSidebarComponent,
    CardCustomerRequestsComponent,
    CardCompanyRequestsComponent,
    CardCompanyHistoryComponent,
    CardCustomerHistoryComponent,
    CardCompanySettingsComponent,
    CardCustomerSettingsComponent,
    HistoryComponent,
    CardRequestOverviewComponent,
    CardApplicationOverviewComponent,
    CardTransactionTableComponent,
    CardTransactionOverviewComponent,
    CardReportTableComponent,
    CardReportOverviewComponent,
    ReportComponent,
    ApplicationComponent,
    TransactionComponent,
    ReviewApplicationComponent,
    SelectServiceComponent,
    CardServiceComponent,
    AlertsComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    NgxLoadingModule,
    NgPipesModule
  ],
  providers: [EmailService, AuthService, RegisterService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
