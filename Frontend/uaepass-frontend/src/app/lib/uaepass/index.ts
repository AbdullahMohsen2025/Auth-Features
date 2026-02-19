/**
 * UAE Pass – reusable, injectable service for any Angular app.
 *
 * Usage in your app:
 * 1. In app.config.ts add: provideUaePass({ apiBaseUrl: 'https://your-api.com/api/Config' })
 * 2. Inject UaePassService in components and call isEnabled(), getConfig(), handleCallback(), etc.
 */

export { Config_OPTIONS, DEFAULT_Config_OPTIONS } from './config-options';
export type { ConfigOptions } from './config-options';
export { provideUaePass } from './provide-uaepass';
