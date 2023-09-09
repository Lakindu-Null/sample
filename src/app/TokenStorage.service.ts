import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(private cookieService: CookieService) { }

  signOut(): void {
    this.cookieService.delete(TOKEN_KEY);
    this.cookieService.delete(REFRESHTOKEN_KEY);
    console.log('sign outed');
  }

  public saveToken(token: string): void {    
    this.cookieService.delete(TOKEN_KEY);
    this.cookieService.set(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return this.cookieService.get(TOKEN_KEY);
  }

  public saveRefreshToken(token: string): void {
    this.cookieService.delete(REFRESHTOKEN_KEY);
    this.cookieService.set(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return this.cookieService.get(REFRESHTOKEN_KEY);
  }

  public saveUser(user: any): void {
    this.cookieService.delete(USER_KEY);
    this.cookieService.set(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = this.cookieService.get(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

}
