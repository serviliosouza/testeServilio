import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '@app/services/auth.service';
import {environment} from '@env/environment';


@Injectable()
export class APIInterceptor implements HttpInterceptor {

  url: string;

  constructor(protected auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith('blob:') && req.url.match(/^(?:(?:\w+:\/\/)|\/)/) === null) {
      const apiReq = req.clone({url: `${environment.api_url.replace(/\/$/, '')}/${req.url}`});
      return next.handle(apiReq);
    }
    return next.handle(req);
  }
}
