import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private config: ITokenConfig;
  private memoryStore: Object;

  constructor(private router: Router) {
    this.config = new ITokenConfig({
      tokenName: 'id_token',
      storageType: 'localStorage'
    });
  }

  setToken(value: string) {
    try {
      window[this.config.storageType].setItem(this.config.tokenName, value);
    } catch (error) {
      this.memoryStore[this.config.tokenName] = value;
    }
  }

  getToken(): string {
    try {
      return window[this.config.storageType].getItem(this.config.tokenName);
    }
    catch (error) {
      return this.memoryStore[this.config.tokenName];
    }
  }

  removeToken() {
    try {
      window[this.config.storageType].removeItem(this.config.tokenName);
    } catch (error) {
      delete this.memoryStore[this.config.tokenName];
    }
  }

  isAuthenticated() {
    let token = this.getToken();
    if (token) {
      if (token.split('.').length === 3) {
        try {
          let base64Url = token.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace(' ', '/');
          const exp = JSON.parse(window.atob(base64)).exp;
          if (exp) {
            // Date.parse(new Date().toString()) = new Date().getTime();
            return (Math.round(new Date().getTime() / 1000) >= exp) ? false : true;
          }
        } catch (error) {
          return true;  // Pass: Non-JWT token that looks like JWT 
        }
      }
      return true;  // Pass: All other tokens
    }

    return false;  // Fail: No token at all
  }
}

class ITokenConfig {
  tokenName: string;
  storageType: string;
  constructor(tokenConfig?: any) {
    this.tokenName = tokenConfig.tokenName;
    this.storageType = tokenConfig.storageType;
  }
}
