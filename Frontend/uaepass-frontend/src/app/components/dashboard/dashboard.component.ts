import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UaePassService, UaePassUserInfo } from '../../services/uaepass.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userInfo: UaePassUserInfo | null = null;
  configError: string | null = null;
  configLoading = true;

  accessToken: string | null = null; // Variable to hold the token

  // Variables for the API test
  apiResponse: string | null = null;
  apiLoading = false;
  apiError: string | null = null;

  constructor(
    private uaepassService: UaePassService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get user info from session storage
    this.userInfo = this.uaepassService.getUserInfo();
    this.accessToken = sessionStorage.getItem('auth_token');
    
    // If no user info, redirect to login
    if (!this.userInfo) {
      this.router.navigate(['/']);
    }
  }

  /** Clear stored user (logout). */
  logout(): void {
    this.uaepassService.getConfig().subscribe({
      next: (config) => {
        this.configLoading = false;
        console.log('UAE Pass Config received:', config);

        if (!config) {
          this.configError = 'configs are missed';
          console.error('UAE Pass configs is null or undefined:', config);
          return;
        }

        sessionStorage.removeItem('uaepass_user');
        window.location.href = `${config.baseUrl}/logout?redirect_uri=${config.redirectUrl}`;
        console.log('User Logged out Successfully');
      },
      error: (error) => {
        this.configLoading = false;
        this.configError = error?.message || 'Failed to Logout.';
        console.error('Error Logout UAE Pass User:', error);
      }
    });
  }

  get displayName(): string {
    if (!this.userInfo) return 'User';
    return this.userInfo.fullnameEN ||
      `${this.userInfo.firstnameEN || ''} ${this.userInfo.lastnameEN || ''}`.trim() ||
      this.userInfo.email ||
      'User';
  }

  /** Call the new backend API */
  callProtectedApi(): void {
    if (!this.accessToken) {
      debugger
      this.apiError = 'No access token found. Please login again.';
      return;
    }

    this.apiLoading = true;
    this.apiResponse = null;
    this.apiError = null;

    this.uaepassService.testProtectedApi(this.accessToken).subscribe({
      
      next: (response) => {
        this.apiLoading = false;
        this.apiResponse = response; // The string from backend
        console.log('API Success:', response);
      },
      error: (err) => {
        this.apiLoading = false;
        this.apiError = 'API Call Failed. Check console.';
        console.error(err);
      }
    });
  }
}
