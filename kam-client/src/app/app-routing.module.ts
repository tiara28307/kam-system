import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// layouts
import { UserComponent } from "./layouts/user/user.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// user views
import { CustomerKycDashboardComponent } from "./views/user/dashboards/customer-kyc-dashboard/customer-kyc-dashboard.component";
import { SettingsComponent } from "./views/user/settings/settings.component";
import { TablesComponent } from "./views/user/tables/tables.component";
import { CompanyAmlDashboardComponent } from "./views/user/dashboards/company-aml-dashboard/company-aml-dashboard.component";
import { CompanyCaseManagementDashboardComponent } from "./views/user/dashboards/company-case-management-dashboard/company-case-management-dashboard.component";
import { CompanyKycDashboardComponent } from "./views/user/dashboards/company-kyc-dashboard/company-kyc-dashboard.component";

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/register/register.component";
import { ForgotPasswordComponent } from "./views/auth/forgot-password/forgot-password.component";

// no layouts views
import { IndexComponent } from "./views/index/index.component";
import { LandingComponent } from "./views/landing/landing.component";
import { ProfileComponent } from "./views/profile/profile.component";

// auth guards
import { CustomerAuthGuard } from "./auth/customer-auth-guard";
import { CompanyAuthGuard } from "./auth/company-auth.guard";

const routes: Routes = [
  // user views
  {
    path: "user",
    component: UserComponent,
    children: [
      { path: "kyc/onboarding/dashboard/:id", component: CustomerKycDashboardComponent, canActivate: [CustomerAuthGuard] },
      { path: "kyc/screening/dashboard/:id", component: CompanyKycDashboardComponent, canActivate: [CompanyAuthGuard] },
      { path: "aml/dashboard/:id", component: CompanyAmlDashboardComponent, canActivate: [CompanyAuthGuard] },
      { path: "casemanagement/dashboard/:id", component: CompanyCaseManagementDashboardComponent, canActivate: [CompanyAuthGuard] },
      { path: "customer/settings/:id", component: SettingsComponent, canActivate: [CustomerAuthGuard] },
      { path: "company/settings/:id", component: SettingsComponent, canActivate: [CompanyAuthGuard] },
      { path: "tables", component: TablesComponent },
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
  { path: "", component: IndexComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
