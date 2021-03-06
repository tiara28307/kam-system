import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// layouts
import { UserComponent } from "./layouts/user/user.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// user views
import { CustomerKycDashboardComponent } from "./views/user/customer/customer-kyc-dashboard/customer-kyc-dashboard.component";
import { CompanyKycDashboardComponent } from "./views/user/company/company-kyc-dashboard/company-kyc-dashboard.component";

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/register/register.component";
import { ForgotPasswordComponent } from "./views/auth/forgot-password/forgot-password.component";

// no layouts views
import { IndexComponent } from "./views/index/index.component";

// auth guards
import { CustomerAuthGuard } from "./auth/customer-auth-guard";
import { CompanyAuthGuard } from "./auth/company-auth.guard";
import { RequestsComponent } from "./views/user/requests/requests.component";
import { ApplicationComponent } from "./views/user/customer/application/application.component";
import { ReviewApplicationComponent } from "./views/user/company/review-application/review-application.component";
import { CustomerSettingsComponent } from "./views/user/customer/customer-settings/customer-settings.component";
import { CompanySettingsComponent } from "./views/user/company/company-settings/company-settings.component";
import { ChangePasswordComponent } from "./views/auth/change-password/change-password.component";
import { AdminDashboardComponent } from "./views/admin/admin-dashboard/admin-dashboard.component";
import { HistoryComponent } from "./views/user/company/history/history.component";
import { KycSearchComponent } from "./views/user/company/kyc-search/kyc-search.component";

const routes: Routes = [
  // user views
  {
    path: "user",
    component: UserComponent,
    children: [
      // Setting Routes
      { path: "customer/settings", component: CustomerSettingsComponent, canActivate: [CustomerAuthGuard] },
      { path: "company/settings", component: CompanySettingsComponent, canActivate: [CompanyAuthGuard] },

      // KYC Onboarding Service Routes
      { path: "kyc/onboarding/dashboard", component: CustomerKycDashboardComponent, canActivate: [CustomerAuthGuard] },
      { path: "kyc/onboarding/requests", component: RequestsComponent, canActivate: [CustomerAuthGuard] },
      { path: "kyc/onboarding/application/:id", component: ApplicationComponent, canActivate: [CustomerAuthGuard] },
      
      // KYC Screening Service Routes
      { path: "kyc/screening/dashboard", component: CompanyKycDashboardComponent, canActivate: [CompanyAuthGuard] },
      { path: "kyc/screening/requests", component: RequestsComponent, canActivate: [CompanyAuthGuard] },
      { path: "kyc/screening/history", component: HistoryComponent, canActivate: [CompanyAuthGuard] },
      { path: "kyc/screening/application/:id", component: ReviewApplicationComponent, canActivate: [CompanyAuthGuard] },
      { path: "kyc/screening/search", component: KycSearchComponent, canActivate: [CompanyAuthGuard] },

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
      { path: "changepassword", component: ChangePasswordComponent },
      { path: "", redirectTo: "login", pathMatch: "full" },
    ],
  },

  { path: "kam/blockchain", component: AdminDashboardComponent },
  { path: "", component: IndexComponent },
  
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
