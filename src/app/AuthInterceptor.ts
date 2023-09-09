import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, filter, switchMap, take, timeout } from 'rxjs/operators';
import { TokenStorageService } from './TokenStorage.service';
import { Router } from '@angular/router';
import { Authenticatorservice } from './auth/services/authentication.service';
import { CommonFunctions } from './util/CommonFunctions';

const TOKEN_HEADER_KEY = 'Authorization';
const REFRESHER_HEADER_KEY = 'isRefreshToken';
const REFRESHER_AUDIANCE_KEY = 'audience';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private tokenService: TokenStorageService, @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number, private authService: Authenticatorservice, public router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {

    let authReq = req;
    const token = this.tokenService.getToken();
    if (token != null) {
      if (!authReq.url.includes('auth/authenticate')) {
        authReq = this.addTokenHeader(req, token);
      }
      if (authReq.url.includes('auth/refreshtoken')) {
        authReq = this.addRefreshTokenHeader(req, token);
      }
    }

    return next.handle(authReq).pipe(
      timeout(this.defaultTimeout),
      catchError(error => {
        if (error instanceof TimeoutError) {
          console.error('Timeout has occurred', req.url);
        }
        if (error.status === 0) {
          console.log('connection refuced ');
        }

        if (error.status === 403) 
        {
          this.router.navigate(['/unauthorized']);
        }

        if (error instanceof HttpErrorResponse && !authReq.url.includes('/refreshtoken') && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        if (error instanceof HttpErrorResponse && authReq.url.includes('/refreshtoken') && error.status === 401) {
          this.redirect();
        }
        return throwError(() => error);
      }));
  }

  redirect() {
    this.tokenService.signOut();
    this.router.navigateByUrl('auth/login');
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const retoken = this.tokenService.getRefreshToken();
      if (retoken)
        return this.authService.refreshToken(retoken).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.tokenService.saveToken(token.accesstoken);
            this.refreshTokenSubject.next(token.accesstoken);
            return next.handle(this.addTokenHeader(request, token.accesstoken));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.redirect();
            return throwError(() => err);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone(
      {
        headers: request.headers
          .set(TOKEN_HEADER_KEY, 'Bearer ' + token)
      });
  }

  private addRefreshTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone(
      {
        headers: request.headers
          .set(TOKEN_HEADER_KEY, 'Bearer ' + token)
           .set(REFRESHER_AUDIANCE_KEY, CommonFunctions.clientId)
          .set(REFRESHER_HEADER_KEY, 'true')
      });
  }

}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: DEFAULT_TIMEOUT, useValue: 10000 }
];