import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DoNotHavePermissionToPageAlert } from 'src/constants/alerts.constant';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyAuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let isAuth = this.authService.isAuthenticated('COMPANY');
    
    if(!isAuth) {
      DoNotHavePermissionToPageAlert.fire({})
        .then((result) => {
          this.router.navigate(['/auth/login'])
        });
    }

    return isAuth;
  }
}
