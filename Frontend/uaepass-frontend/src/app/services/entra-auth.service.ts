import { Injectable } from '@angular/core';
import {
  PublicClientApplication,
  AccountInfo,
  AuthenticationResult,
  Configuration,
  LogLevel
} from '@azure/msal-browser';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService } from './app-config.service'; // Import Config Service

@Injectable({
  providedIn: 'root',
})
export class EntraAuthService {
  // Remove assignment via 'new', mark as optional/late init
  private msalInstance!: PublicClientApplication; 
  private initialized = false;

  readonly isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private configService: AppConfigService) {
    // Config is already loaded via APP_INITIALIZER by the time this runs
    this.init();
  }

  private async init(): Promise<void> {
    const entraSettings = this.configService.entraConfig;

    if (!entraSettings) {
      console.error('Entra ID Config is missing!');
      return;
    }

    // 1. Construct MSAL Configuration dynamically
    const msalConfig: Configuration = {
      auth: {
        clientId: entraSettings.clientId,
        authority: `${entraSettings.instance}${entraSettings.tenantId}`,
        redirectUri: entraSettings.redirectUrl,
      },
      cache: {
        cacheLocation: 'localStorage',
      },
      system: {
        loggerOptions: {
          loggerCallback: (level, message, containsPii) => {
            if (containsPii) return;
            if (level === LogLevel.Error) console.error(message);
          },
          logLevel: LogLevel.Warning // Adjust as needed
        }
      }
    };

    // 2. Instantiate MSAL
    this.msalInstance = new PublicClientApplication(msalConfig);

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
      console.error('MSAL initialization error', e);
      this.initialized = true;
      this.isAuthenticated$.next(false);
    }
  }

  // Helper to retrieve scopes 
  private getScopes(): string[] {
    const scopesStr = this.configService.entraConfig?.scopes || '';
    return scopesStr ? scopesStr.split(' ') : ['User.Read']; // Default fallback
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    await new Promise<void>((resolve) => {
      const check = () => {
        if (this.initialized) resolve();
        else setTimeout(check, 50);
      };
      check();
    });
  }

  async loginRedirect(): Promise<void> {
    await this.ensureInitialized();
    await this.msalInstance.loginRedirect({
      scopes: this.getScopes() // Use dynamic scopes
    });
  }

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

  async acquireApiToken(): Promise<string> {
    const account = await this.getActiveAccount();
    if (!account) {
      throw new Error('No active account – user must sign in first.');
    }

    const dynamicScopes = this.getScopes();

    try {
      const result = await this.msalInstance.acquireTokenSilent({
        scopes: dynamicScopes,
        account,
      });
      return result.accessToken;
    } catch (e) {
      console.warn('Silent token acquisition failed, trying redirect', e);
      await this.msalInstance.loginRedirect({
        scopes: dynamicScopes,
        account
      });
      // This part might not be reached due to redirect
      throw e; 
    }
  }
}