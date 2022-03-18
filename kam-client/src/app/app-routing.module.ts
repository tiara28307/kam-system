import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// layouts
import { UserComponent } from "./layouts/user/user.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// user views
import { DashboardComponent } from "./views/user/dashboard/dashboard.component";
import { MapsComponent } from "./views/user/maps/maps.component";
import { SettingsComponent } from "./views/user/settings/settings.component";
import { TablesComponent } from "./views/user/tables/tables.component";

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/registers/register.component";

// no layouts views
import { IndexComponent } from "./views/index/index.component";
import { LandingComponent } from "./views/landing/landing.component";
import { ProfileComponent } from "./views/profile/profile.component";

// env config
import { environment } from "src/environments/environment";
import { AuthGuard } from "./auth/auth.guard";
import { ForgotPasswordComponent } from "./views/auth/forgot-password/forgot-password.component";

const routes: Routes = [
  // user views
  {
    path: "user",
    component: UserComponent,
    children: [
      // TODO: Add /:id for user paths
      { path: "dashboard/:id", component: DashboardComponent },
      { path: "settings/:id", component: SettingsComponent },
      { path: "tables", component: TablesComponent },
      { path: "maps", component: MapsComponent },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
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
