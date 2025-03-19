import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Profile } from '../interfaces/profile.interface';
import { Pagable } from '../interfaces/pagable.interface';
import { map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    http = inject(HttpClient);

    baseApiUrl = 'https://icherniakov.ru/yt-course';

    me = signal<Profile | null>(null);
    filteredProfiles = signal<Profile[]>([]);

    getTestAccounts() {
        return this.http.get<Profile[]>(`${this.baseApiUrl}/account/test_accounts`);
    }

    getMe() {
        return this.http.get<Profile>(`${this.baseApiUrl}/account/me`)
            .pipe(
                tap(val => this.me.set(val))
            );
    }

    getAccount(id: string) {
        return this.http.get<Profile>(`${this.baseApiUrl}/account/${id}`);
    }

    getSubscribersShortList(subscribersAmount: number) {
        const skipCount = 0;

        return this.http.get<Pagable<Profile>>(`${this.baseApiUrl}/account/subscribers/`)
            .pipe(
                map(val => val.items.slice(skipCount, subscribersAmount + skipCount))
            );
    }

    patchProfile(profile: Partial<Profile>) {
        return this.http.patch<Profile>(
            `${this.baseApiUrl}/account/me`, 
            profile
        );
    }

    uploadAvatar(avatarFile: File) {
        const fd = new FormData();
        fd.append('image', avatarFile);

        return this.http.post<Profile>(
            `${this.baseApiUrl}/account/upload_image`,
            fd
        );
    }

    filterProfiles(params: Record<string, any>) {
        return this.http.get<Pagable<Profile>>(
            `${this.baseApiUrl}/account/accounts`,
            { params }
        ).pipe(
            tap(res => this.filteredProfiles.set(res.items))
        );
    }
}
