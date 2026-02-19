import { InjectionToken } from '@angular/core';

/**
 * Options for the UAE Pass service. Provide via provideUaePass() or UAE_PASS_OPTIONS.
 * Use in any Angular app by adding the provider to app.config.
 */
export interface UaePassOptions {
  /**
   * Base URL of the UAE Pass API (e.g. 'https://localhost:7034/api/UAEPass' or '/api/UAEPass').
   */
  apiBaseUrl: string;

  /**
   * Optional custom endpoint paths (defaults: config, is-enabled, callback).
   */
  endpoints?: {
    config?: string;
    isEnabled?: string;
    callback?: string;
    testtoken?: string;
  };
}

export const UAE_PASS_OPTIONS = new InjectionToken<UaePassOptions>('UAE_PASS_OPTIONS');

export const DEFAULT_UAE_PASS_OPTIONS: UaePassOptions = {
  apiBaseUrl: '/api/UAEPass',
  endpoints: {
    config: 'config',
    isEnabled: 'is-enabled',
    callback: 'callback',
    testtoken:'test-token'
  }
};
