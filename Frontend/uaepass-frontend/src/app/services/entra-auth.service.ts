import { Injectable } from '@angular/core';
import {
  PublicClientApplication,
  AccountInfo,
  AuthenticationResult,
} from '@azure/msal-browser';
import { BehaviorSubject } from 'rxjs';
import { msalConfig, loginRequest } from '../entra-auth.config';

@Injectable({
  providedIn: 'root',
})
export class EntraAuthService {
  private msalInstance = new PublicClientApplication(msalConfig);
  private initialized = false;

  /** Emits true when there is an active account */
  readonly isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Initialize MSAL and process any redirect result (similar to React POC)
    this.init();
  }

  private async init(): Promise<void> {
    try {
      await this.msalInstance.initialize();
      const response = await this.msalInstance.handleRedirectPromise();

      if (response && response.account) {
        this.msalInstance.setActiveAccount(response.account);
      } else {
        const accounts = this.msalInstance.getAllAccounts();
        if (accounts.length === 1) {
          this.msalInstance.setActiveAccount(accounts[0]);
        }
      }

      this.initialized = true;
      this.isAuthenticated$.next(!!this.msalInstance.getActiveAccount());
    } catch (e) {
      console.error('MSAL initialization / redirect handling error', e);
      this.initialized = true;
      this.isAuthenticated$.next(false);
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    await new Promise<void>((resolve) => {
      const check = () => {
        if (this.initialized) {
          resolve();
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  }

  /** Starts the Entra ID login redirect flow */
  async loginRedirect(): Promise<void> {
    await this.ensureInitialized();
    await this.msalInstance.loginRedirect(loginRequest);
  }

  /** Gets the active account if available */
  private async getActiveAccount(): Promise<AccountInfo | null> {
    await this.ensureInitialized();
    let account = this.msalInstance.getActiveAccount();
    if (!account) {
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        account = accounts[0];
        this.msalInstance.setActiveAccount(account);
        this.isAuthenticated$.next(true);
      }
    }
    return account;
  }

  /** Acquire an access token for the configured API */
  async acquireApiToken(): Promise<string> {
    const account = await this.getActiveAccount();
    if (!account) {
      throw new Error('No active account – user must sign in first.');
    }

    let result: AuthenticationResult;
    try {
      result = await this.msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });
    } catch (e) {
      console.warn('Silent token acquisition failed, trying redirect', e);
      await this.msalInstance.loginRedirect(loginRequest);
      throw e;
    }

    return result.accessToken;
  }
}

