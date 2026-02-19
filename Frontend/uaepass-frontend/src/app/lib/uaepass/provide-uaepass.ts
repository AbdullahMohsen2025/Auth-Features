import { Provider } from '@angular/core';
import { Config_OPTIONS, ConfigOptions } from './config-options';

/**
 * Provide UAE Pass service with options. Use in any Angular app:
 *
 * app.config.ts:
 *   import { provideUaePass } from './app/lib/uaepass/provide-uaepass';
 *   export const appConfig: ApplicationConfig = {
 *     providers: [
 *       provideHttpClient(),
 *       provideUaePass({ apiBaseUrl: 'https://localhost:7034/api/Config' })
 *     ]
 *   };
 *
 * Then inject UaePassService wherever needed.
 */
export function provideUaePass(options: ConfigOptions): Provider {
  return {
    provide: Config_OPTIONS,
    useValue: options
  };
}
