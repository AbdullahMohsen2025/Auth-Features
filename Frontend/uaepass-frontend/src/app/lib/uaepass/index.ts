/**
 * UAE Pass – reusable, injectable service for any Angular app.
 *
 * Usage in your app:
 * 1. In app.config.ts add: provideUaePass({ apiBaseUrl: 'https://your-api.com/api/UAEPass' })
 * 2. Inject UaePassService in components and call isEnabled(), getConfig(), handleCallback(), etc.
 */

export { UAE_PASS_OPTIONS, DEFAULT_UAE_PASS_OPTIONS } from './uaepass-options';
export type { UaePassOptions } from './uaepass-options';
export { provideUaePass } from './provide-uaepass';
