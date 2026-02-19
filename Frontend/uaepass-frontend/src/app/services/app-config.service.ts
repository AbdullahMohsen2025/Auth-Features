import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FrontendConfig } from '../models/frontend-config.model';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: FrontendConfig | null = null;

  // Update this to match your backend API URL
  private readonly configUrl = 'https://localhost:7034/api/Config/frontend-config'; 

  constructor(private http: HttpClient) {}

  public async loadConfig(): Promise<void> {
    try {
      this.config = await lastValueFrom(this.http.get<FrontendConfig>(this.configUrl));
      console.log('App Config Loaded:', this.config);
    } catch (error) {
      console.error('Failed to load application config', error);
      throw error; // This will block app startup if config fails
    }
  }

  get entraConfig() {
    return this.config?.entraID;
  }

  get uaePassConfig() {
    return this.config?.uaePass;
  }
}