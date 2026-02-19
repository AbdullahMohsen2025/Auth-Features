import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { provideUaePass } from './lib/uaepass';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    // UAE Pass – injectable service; change apiBaseUrl for your backend
    provideUaePass({ apiBaseUrl: 'https://localhost:7034/api/UAEPass' })
  ]
};
