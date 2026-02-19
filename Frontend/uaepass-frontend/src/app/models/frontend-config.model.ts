export interface EntraIdConfig {
  instance: string;
  tenantId: string;
  clientId: string;
  redirectUrl: string;
  scopes: string;
}

export interface UaePassConfig {
  clientId: string;
  baseUrl: string;
  scope: string;
  state: string;
  acrValues: string;
  redirectUrl: string;
}

export interface FrontendConfig {
  entraID: EntraIdConfig;
  uaePass: UaePassConfig;
}