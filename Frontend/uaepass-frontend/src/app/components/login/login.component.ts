import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UaePassService } from '../../services/uaepass.service';
import { EntraLoginComponent } from "../entra-login/entra-login.component";

enum Languages {
  English = 'en',
  Arabic = 'ar'
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, EntraLoginComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Languages = Languages;
  currentLang: string = 'en';
  uaePassloginUrl: string = '';
  configError: string | null = null;
  configLoading = true;
  isUaePassEnabled = false;
  uiLocales = 'en'; //just for test purpose
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private uaepassService: UaePassService
  ) { }

  ngOnInit(): void {
    this.checkUaePassEnabled();

    if (window.location.href.includes('code')) {
      this.loading = true;
      // Get authorization code from URL query parameters
      this.route.queryParams.subscribe(params => {
        const accessCode = params['code'];
        const state = params['state'];
        const error = params['error'];

        if (error) {
          this.error = `Authentication failed: ${error}`;
          this.loading = false;
          return;
        }

        if (!accessCode) {
          this.error = 'No authorization code received';
          this.loading = false;
          return;
        }

        // Handle the callback
        this.handleUaePassCallback(accessCode, state);
      });
    }
  }

  checkUaePassEnabled(): void {
    this.configLoading = true;
    this.configError = null;
    console.log('Calling backend: CheckUAEPassEnabled (is-enabled)');
    this.uaepassService.isEnabled().subscribe({
      next: (enabled) => {
        this.isUaePassEnabled = enabled;
        console.log('UAE Pass enabled:', enabled);
        if (enabled) {
          this.loadConfig();
        } else {
          this.configLoading = false;
          this.configError = 'UAE Pass authentication is currently disabled';
        }
      },
      error: (error) => {
        this.configLoading = false;
        this.configError = error?.message || 'Failed to check UAE Pass. Is backend running at https://localhost:7034?';
        console.error('Error checking UAE Pass enabled:', error);
      }
    });
  }

  loadConfig(): void {
    this.uaepassService.getConfig().subscribe({
      next: (config) => {
        this.configLoading = false;
        console.log('UAE Pass Config received:', config);

        if (!config) {
          this.configError = 'configs are missed';
          console.error('UAE Pass configs is null or undefined:', config);
          return;
        }

        this.uaePassloginUrl = `${config.baseUrl}/authorize?response_type=code&client_id=${config.clientId}&scope=${config.scope}&state=${config.state}&redirect_uri=${config.redirectUrl}&acr_values=${config.acrValues}&ui_locales=${this.uiLocales}`;
        console.log('UAE Pass Login URL constructed:', this.uaePassloginUrl);
      },
      error: (error) => {
        this.configLoading = false;
        this.configError = error?.message || 'Failed to load config.';
        console.error('Error loading UAE Pass config:', error);
      }
    });
  }

  getLoginButtonImage(): string {
    return 'UAEPass.svg';
  }

  getLoginButtonAlt(): string {
    return this.currentLang === Languages.Arabic
      ? 'تسجيل الدخول باستخدام UAE Pass'
      : 'Sign in with UAE Pass';
  }

  handleUaePassCallback(accessCode: string, state?: string): void {
    this.uaepassService.handleCallback(accessCode, state).subscribe({
      next: (response) => {
        console.log('User authenticated successfully:', response);

        // 1. Check if userInfo exists before passing it
        if (response.userInfo) {
            this.uaepassService.storeUserInfo(response.userInfo);
            
            // 2. (Optional) Store the token if you need it later
            if (response.accessToken) {
                sessionStorage.setItem('auth_token', response.accessToken);
            }

            this.router.navigate(['/dashboard']);
        } else {
            console.error('Response received but User Info is missing');
            this.error = 'Login failed: No user data received.';
        }
      },
      error: (error) => {
        console.error('Error handling UAE Pass callback:', error);
        this.error = 'Failed to authenticate with UAE Pass. Please try again.';
        this.loading = false;
      }
    });
  }

}
