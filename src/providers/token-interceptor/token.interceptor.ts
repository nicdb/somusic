import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { AuthProvider } from "../auth/auth";
import 'rxjs/add/operator/switchMap';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor (private inj: Injector){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.inj.get(AuthProvider);
    return fromPromise(auth.getAuthorizationHeader())
      .switchMap(authHeader => {
        if(authHeader) {
          const authReq = req.clone({
            headers: req.headers.set('Authorization', authHeader)
          });
          const credentialReq = authReq.clone({
            withCredentials: true
          });
          return next.handle(credentialReq);
        } else {
          const credentialReq = req.clone({
            withCredentials: true
          });
          return next.handle(credentialReq);
        }
      });
  }
}
