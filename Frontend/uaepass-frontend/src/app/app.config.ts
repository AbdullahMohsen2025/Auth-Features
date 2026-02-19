import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { provideUaePass } from './lib/uaepass'; // Your existing UaePass provider
import { AppConfigService } from './services/app-config.service';

// Factory function to load config
export function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    
    // 1. Add the Config Service logic
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService],
      multi: true
    },

    // 2. Keep your existing UAE Pass logic 
    // (Note: You could eventually update this to use the same config endpoint if desired)
    provideUaePass({ apiBaseUrl: 'https://localhost:7034/api/Config' }) 
  ]
};