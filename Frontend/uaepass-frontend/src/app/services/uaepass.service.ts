import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppConfigService } from './app-config.service';

export interface UaePassConfig {
  clientId: string;
  baseUrl: string;
  scope: string;
  state: string;
  acrValues: string;
  redirectUrl: string;
}

export interface UaePassAuthResponse {
  accessToken?: string;
  userInfo?: UaePassUserInfo;
}

export interface UaePassUserInfo {
  sub?: string;
  email?: string;
  mobile?: string;
  firstnameEN?: string;
  lastnameEN?: string;
  firstnameAR?: string;
  lastnameAR?: string;
  fullnameEN?: string;
  fullnameAR?: string;
  gender?: string;
  nationalityEN?: string;
  nationalityAR?: string;
  idn?: string;
  uuid?: string;
  userType?: string;
}

@Injectable({ providedIn: 'root' })
export class UaePassService {
  
  // Define endpoint paths relative to the controller
  private readonly endpoints = {
    callback: 'callback',
    testtoken: 'test-token',
    isEnabled: 'is-enabled'
  };

  private readonly apiBaseUrl = 'https://localhost:7034/api/Config';

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService // Central Config for static settings (Client ID, etc)
  ) {}

  /** 
   * Get UAE Pass configuration.
   */
  getConfig(): Observable<UaePassConfig | undefined> {
    return of(this.appConfig.uaePassConfig);
  }

  /** 
   * Check if UAE Pass is enabled.
   */
  isEnabled(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiBaseUrl}/${this.endpoints.isEnabled}`);
  }

  /** Handle callback: exchange code for user info via backend. */
  handleCallback(accessCode: string, state?: string): Observable<UaePassAuthResponse> {
    const params: Record<string, string> = { accessCode };
    if (state) params['state'] = state;
    
    return this.http.get<UaePassAuthResponse>(`${this.apiBaseUrl}/${this.endpoints.callback}`, { params });
  }

  /** Store user info in session storage. */
  storeUserInfo(userInfo: UaePassUserInfo): void {
    sessionStorage.setItem('uaepass_user', JSON.stringify(userInfo));
  }

  /** Get stored user info. */
  getUserInfo(): UaePassUserInfo | null {
    const stored = sessionStorage.getItem('uaepass_user');
    return stored ? JSON.parse(stored) : null;
  }

  /** Whether user is logged in (has stored user). */
  isLoggedIn(): boolean {
    return this.getUserInfo() !== null;
  }

  /**
   * Calls the protected backend API using the Bearer token.
   */
  testProtectedApi(accessToken: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    return this.http.get(`${this.apiBaseUrl}/${this.endpoints.testtoken}`, { 
      headers: headers, 
      responseType: 'text' 
    });
  }
}