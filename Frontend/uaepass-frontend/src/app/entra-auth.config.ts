import type { Configuration } from '@azure/msal-browser';
import { LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: 'aea29998-803c-4f02-98aa-b5c87202f7a8',
    authority: 'https://login.microsoftonline.com/10030e18-4551-4846-81df-5d0f21a17d2c',
    redirectUri: 'http://localhost:4200/entra-login',
  },
  cache: {
    cacheLocation: 'localStorage',
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
      logLevel: LogLevel.Info,
    },
  },
};

export const loginRequest = {
  scopes: ['api://1e96cba2-9cd6-4e1f-9d89-5c5846b68584/access_as_user'],
};

