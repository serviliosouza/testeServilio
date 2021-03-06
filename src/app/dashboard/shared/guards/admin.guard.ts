import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {UserRole} from '@app/commons';
import {AppService} from '@app/services/app.service';
import {AuthService} from '@app/services/auth.service';


@Injectable()
export class AdminGuard implements CanActivate {
  constructor(protected auth: AuthService, protected app: AppService, protected router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const me = await this.auth.getUser();
    if (me.role !== UserRole.Administrador) {
      this.app.alert('Você não ter permissão para fazer isso', 'Acesso negado').then();
      return this.router.navigateByUrl('/');
    }

    return true;
  }
}
