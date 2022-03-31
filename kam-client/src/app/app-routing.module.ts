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
import { LandingComponent } from "./views/other-may-remove/landing/landing.component";
import { ProfileComponent } from "./views/other-may-remove/profile/profile.component";

// auth guards
import { CustomerAuthGuard } from "./auth/customer-auth-guard";
import { CompanyAuthGuard } from "./auth/company-auth.guard";
import { RequestsComponent } from "./views/user/requests/requests.component";
import { ApplicationComponent } from "./views/user/customer/application/application.component";
import { ReviewApplicationComponent } from "./views/user/company/review-application/review-application.component";
import { SettingsComponent } from "./views/user/settings/settings.component";

const routes: Routes = [
  // user views
  // TODO: add back Auth Guards for each user page
  {
    path: "user",
    component: UserComponent,
    children: [
      // Settings
      { path: "customer/settings", component: SettingsComponent, canActivate: [CustomerAuthGuard] },
      { path: "company/settings", component: SettingsComponent, canActivate: [CompanyAuthGuard] },

      // KYC Onboarding Service Routes
      { path: "kyc/onboarding/dashboard", component: CustomerKycDashboardComponent},
      { path: "kyc/onboarding/requests", component: RequestsComponent},
      { path: "kyc/onboarding/application/:id", component: ApplicationComponent},
      
      // KYC Screening Service Routes
      { path: "kyc/screening/dashboard", component: CompanyKycDashboardComponent, canActivate: [CompanyAuthGuard] },
      { path: "kyc/screening/requests", component: RequestsComponent, canActivate: [CompanyAuthGuard] },
      { path: "kyc/screening/application/:id", component: ReviewApplicationComponent, canActivate: [CompanyAuthGuard] },

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
