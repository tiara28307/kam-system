import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// layouts
import { UserComponent } from "./layouts/user/user.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// user views
import { CustomerKycDashboardComponent } from "./views/user/dashboards/customer-kyc-dashboard/customer-kyc-dashboard.component";
import { SettingsComponent } from "./views/user/settings/settings.component";
import { TablesComponent } from "./views/user/other-may-remove/tables/tables.component";
import { CompanyAmlDashboardComponent } from "./views/user/dashboards/company-aml-dashboard/company-aml-dashboard.component";
import { CompanyCaseManagementDashboardComponent } from "./views/user/dashboards/company-case-management-dashboard/company-case-management-dashboard.component";
import { CompanyKycDashboardComponent } from "./views/user/dashboards/company-kyc-dashboard/company-kyc-dashboard.component";

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/register/register.component";
import { ForgotPasswordComponent } from "./views/auth/forgot-password/forgot-password.component";

// no layouts views
import { IndexComponent } from "./views/index/index.component";
import { LandingComponent } from "./views/other-may-remove/landing/landing.component";
import { ProfileComponent } from "./views/other-may-remove/profile/profile.component";

// auth guards
import { CustomerAuthGuard } from "./auth/customer-auth-guard";
import { CompanyAuthGuard } from "./auth/company-auth.guard";
import { RequestsComponent } from "./views/user/requests/requests.component";
import { TransactionsComponent } from "./views/user/transactions/transactions.component";
import { ReportsComponent } from "./views/user/reports/reports.component";
import { HistoryComponent } from "./views/user/history/history.component";
import { ApplicationComponent } from "./views/user/applications/application/application.component";
import { ReviewApplicationComponent } from "./views/user/applications/review-application/review-application.component";
import { TransactionComponent } from "./views/user/transactions/transaction/transaction.component";
import { ReportComponent } from "./views/user/reports/report/report.component";
import { CustomerSettingsComponent } from "./views/user/settings/customer-settings/customer-settings.component";
import { CompanySettingsComponent } from "./views/user/settings/company-settings/company-settings.component";
import { SelectServiceComponent } from "./views/user/select-service/select-service.component";

const routes: Routes = [
  // user views
  {
    path: "user",
    component: UserComponent,
    children: [
      { path: "kyc/onboarding/dashboard", component: CustomerKycDashboardComponent, canActivate: [CustomerAuthGuard] },
      { path: "kyc/onboarding/requests", component: RequestsComponent, canActivate: [CustomerAuthGuard] },
      { path: "kyc/onboarding/history", component: HistoryComponent, canActivate: [CustomerAuthGuard] },
      { path: "kyc/onboarding/request/:id/application/:id", component: ApplicationComponent, canActivate: [CustomerAuthGuard] },
      { path: "kyc/screening/dashboard", component: CompanyKycDashboardComponent, canActivate: [CompanyAuthGuard] },
      { path: "kyc/screening/requests", component: RequestsComponent, canActivate: [CompanyAuthGuard] },
      { path: "kyc/screening/history", component: HistoryComponent, canActivate: [CompanyAuthGuard] },
      { path: "kyc/screening/request/:id/application/:id", component: ReviewApplicationComponent, canActivate: [CompanyAuthGuard] },
      { path: "aml/dashboard", component: CompanyAmlDashboardComponent, canActivate: [CompanyAuthGuard] },
      { path: "aml/transactions", component: TransactionsComponent, canActivate: [CompanyAuthGuard] },
      { path: "aml/transaction/:id", component: TransactionComponent, canActivate: [CompanyAuthGuard] },
      { path: "casemanagement/dashboard", component: CompanyCaseManagementDashboardComponent, canActivate: [CompanyAuthGuard] },
      { path: "casemanagement/reports", component: ReportsComponent, canActivate: [CompanyAuthGuard] },
      { path: "casemanagement/report/:id", component: ReportComponent, canActivate: [CompanyAuthGuard] },
      { path: "customer/settings", component: CustomerSettingsComponent, canActivate: [CustomerAuthGuard] },
      { path: "company/settings", component: CompanySettingsComponent, canActivate: [CompanyAuthGuard] },
      { path: "", redirectTo: "", pathMatch: "full" },
    ],
  },
  // auth views
  {
    path: "auth",
    component: AuthComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "signup", component: RegisterComponent },
      { path: "forgotpassword", component: ForgotPasswordComponent },
      { path: "", redirectTo: "login", pathMatch: "full" },
    ],
  },
  // no layout views
  { path: "profile", component: ProfileComponent },
  { path: "landing", component: LandingComponent },
  { path: "select/service", component: SelectServiceComponent, canActivate: [CompanyAuthGuard] },
  { path: "", component: IndexComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
