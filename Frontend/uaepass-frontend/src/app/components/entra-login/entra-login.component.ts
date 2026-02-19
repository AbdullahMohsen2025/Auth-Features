import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntraAuthService } from '../../services/entra-auth.service';
import { Observable } from 'rxjs';
import { UaePassService } from '../../services/uaepass.service';

@Component({
  selector: 'app-entra-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entra-login.component.html',
  styleUrls: ['./entra-login.component.css'],
})
export class EntraLoginComponent {
  isAuthenticated$: Observable<boolean>;
  loading = false;
  lastApiResult: any = null;
  error: string | null = null;

  constructor(
    private entraAuth: EntraAuthService,
    private uaePassService: UaePassService,
    private cdr: ChangeDetectorRef
  ) {
    this.isAuthenticated$ = this.entraAuth.isAuthenticated$;
  }

  async login(): Promise<void> {
    this.error = null;
    this.lastApiResult = null;
    try {
      await this.entraAuth.loginRedirect();
    } catch (e: any) {
      console.error('Entra login error', e);
      this.error = e?.message ?? 'Login failed – check console.';
    }
  }

  async callApi(): Promise<void> {
    this.error = null;
    this.lastApiResult = null;
    this.loading = true;

    try {
      // 1. Await the Promise (this effectively pauses execution here)
      const accessToken = await this.entraAuth.acquireApiToken();

      // 2. Subscribe to Observable
      this.uaePassService.testProtectedApi(accessToken).subscribe({
        next: (response) => {
          this.lastApiResult = response;
          console.log('Entra Call Backend API result', response);
          this.loading = false;
          
          // 3. Force Angular to update the HTML View
          this.cdr.detectChanges(); 
        },
        error: (e) => {
          console.error('Error calling test-token API with Entra token', e);
          this.error = 'Error calling backend API – check console.';
          this.loading = false;
          
          // Force update in case of error too
          this.cdr.detectChanges(); 
        }
      });
    } catch (e: any) {
      console.error('Error acquiring Entra token', e);
      this.error = e?.message ?? 'Error acquiring token – check console.';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}