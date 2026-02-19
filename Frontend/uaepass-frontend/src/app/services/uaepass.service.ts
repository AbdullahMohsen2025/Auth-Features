import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config_OPTIONS, ConfigOptions, DEFAULT_Config_OPTIONS } from '../lib/uaepass';

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

/**
 * Reusable UAE Pass client service. Inject in any Angular app.
 * Provide config via provideUaePass({ apiBaseUrl: '...' }) in app.config.
 */
@Injectable({ providedIn: 'root' })
export class UaePassService {
  private readonly options: ConfigOptions;
  private get apiBaseUrl(): string {
    return this.options.apiBaseUrl.replace(/\/$/, '');
  }
  private get endpoints() {
    return { ...DEFAULT_Config_OPTIONS.endpoints, ...this.options.endpoints };
  }

  constructor(
    private http: HttpClient,
    @Optional() @Inject(Config_OPTIONS) options: ConfigOptions | null
  ) {
    this.options = options ?? DEFAULT_Config_OPTIONS;
  }

  /** Get UAE Pass configuration from backend (login URL, logout URL, etc.). */
  getConfig(): Observable<UaePassConfig> {
    return this.http.get<UaePassConfig>(`${this.apiBaseUrl}/${this.endpoints!.frontendconfig}`);
  }

  /** Check if UAE Pass is enabled. */
  isEnabled(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiBaseUrl}/${this.endpoints!.isEnabled}`);
  }

  /** Handle callback: exchange code for user info via backend. */
  handleCallback(accessCode: string, state?: string): Observable<UaePassAuthResponse> {
    const params: Record<string, string> = { accessCode };
    if (state) params['state'] = state;
    return this.http.get<UaePassAuthResponse>(`${this.apiBaseUrl}/${this.endpoints!.callback}`, { params });
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
    // 1. Create headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    // 2. Make the call (expecting text response for this example)
    return this.http.get(`${this.apiBaseUrl}/${this.endpoints!.testtoken}`, { 

      headers: headers, 
      responseType: 'text' 
    });
  }
}
