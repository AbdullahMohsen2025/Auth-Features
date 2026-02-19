import { Provider } from '@angular/core';
import { UAE_PASS_OPTIONS, UaePassOptions } from './uaepass-options';

/**
 * Provide UAE Pass service with options. Use in any Angular app:
 *
 * app.config.ts:
 *   import { provideUaePass } from './app/lib/uaepass/provide-uaepass';
 *   export const appConfig: ApplicationConfig = {
 *     providers: [
 *       provideHttpClient(),
 *       provideUaePass({ apiBaseUrl: 'https://localhost:7034/api/UAEPass' })
 *     ]
 *   };
 *
 * Then inject UaePassService wherever needed.
 */
export function provideUaePass(options: UaePassOptions): Provider {
  return {
    provide: UAE_PASS_OPTIONS,
    useValue: options
  };
}
