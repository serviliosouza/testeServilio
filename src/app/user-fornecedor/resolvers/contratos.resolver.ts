import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {PropostasService} from '@app/user-fornecedor/services/propostas.service';
import {extractRouteParams} from '@app/core';

@Injectable()
export class ContratosResolver implements Resolve<any> {

  constructor(protected service: PropostasService, protected router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const params = extractRouteParams(route);
    if (params.id) {
      try {
        const result = await this.service.getContratos(params.id);
        if (result !== null) {
          return result;
        }
      } catch (e) {
        console.log(e);
      }
    }
    return [];
  }
}

@Injectable()
export class ContratoResolver implements Resolve<any> {

  constructor(protected service: PropostasService, protected router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const params = extractRouteParams(route);
    if (params.id && params.contratoId) {
      try {
        const result = await this.service.getContrato(params.id, params.contratoId);
        if (result !== null) {
          return result;
        }
      } catch (e) {
        console.log(e);
      }
    }
    return null;
  }
}
