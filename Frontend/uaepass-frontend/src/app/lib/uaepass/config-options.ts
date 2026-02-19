import { InjectionToken } from '@angular/core';

/**
 * Options for the UAE Pass service. Provide via provideUaePass() or Config_OPTIONS.
 * Use in any Angular app by adding the provider to app.config.
 */
export interface ConfigOptions {
  /**
   * Base URL of the UAE Pass API (e.g. 'https://localhost:7034/api/Config' or '/api/Config').
   */
  apiBaseUrl: string;

  /**
   * Optional custom endpoint paths (defaults: config, is-enabled, callback).
   */
  endpoints?: {
    frontendconfig?: string;
    isEnabled?: string;
    callback?: string;
    testtoken?: string;
  };
}

export const Config_OPTIONS = new InjectionToken<ConfigOptions>('Config_OPTIONS');

export const DEFAULT_Config_OPTIONS: ConfigOptions = {
  apiBaseUrl: '/api/Config',
  endpoints: {
    frontendconfig: 'frontend-config',
    isEnabled: 'is-enabled',
    callback: 'callback',
    testtoken:'test-token'
  }
};
