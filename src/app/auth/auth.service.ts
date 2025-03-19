import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    baseApiUrl = 'https://icherniakov.ru/yt-course/auth';

    http = inject(HttpClient);
    cookieService = inject(CookieService);
    router = inject(Router);

    accessToken: string | null = null;
    refreshToken: string | null = null;

    get isAuth() {
        if (!this.accessToken) {
            this.accessToken = this.cookieService.get('accessToken');
            this.refreshToken = this.cookieService.get('refreshToken');
        }

        // !! = string to bool
        return !!this.accessToken;
    }

    login(payload: { username: string, password: string }) {
        const fd = new FormData();

        fd.append('username', payload.username);
        fd.append('password', payload.password);

        return this.http.post<TokenResponse>(
            `${this.baseApiUrl}/token`,
            fd
        ).pipe(
            tap(val => this.saveTokens(val))
        );
    }

    refreshAuthToken() {
        return this.http.post<TokenResponse>(
            `${this.baseApiUrl}/refresh`, 
            { refresh_token: this.refreshToken }
        ).pipe(
            tap(val => this.saveTokens(val)),

            catchError(err => {
                this.logout();
                return throwError(err);
            })
        );
    }

    logout() {
        this.cookieService.delete('accessToken');
        this.cookieService.delete('refreshToken');

        this.accessToken = null;
        this.refreshToken = null;

        this.router.navigate(['/login']);
    }

    saveTokens(res: TokenResponse) {
        this.accessToken = res.access_token;
        this.refreshToken = res.refresh_token;

        this.cookieService.set('accessToken', this.accessToken);
        this.cookieService.set('refreshToken', this.refreshToken);
    }
}
