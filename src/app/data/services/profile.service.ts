import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Profile } from '../interfaces/profile.interface';
import { Pagable } from '../interfaces/pagable.interface';
import { map, of, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    http = inject(HttpClient);

    baseApiUrl = 'https://icherniakov.ru/yt-course';
    accountApiUrl = 'https://icherniakov.ru/yt-course/account';

    me = signal<Profile | null>(null);
    filteredProfiles = signal<Profile[]>([]);

    getTestAccounts() {
        return this.http.get<Profile[]>(`${this.accountApiUrl}/test_accounts`);
    }

    getTestSubscribers() {
        return this.http.get<Pagable<Profile[]>>(`${this.accountApiUrl}/subscribers/`);
    }

    getTestSubscribersShortList(subscribersShowingAmount: number = 6) {
        return this.http.get<Pagable<Profile>>(`${this.accountApiUrl}/subscribers/`)
            .pipe(
                map(val => val.items = this.getShortList(val.items, subscribersShowingAmount))
            );
    }

    getMe() {
        return this.http.get<Profile>(`${this.accountApiUrl}/me`)
            .pipe(
                tap(val => this.me.set(val))
            );
    }

    getAccount(accountId: number) {
        return this.http.get<Profile>(`${this.accountApiUrl}/${accountId}`);
    }

    getSubscribersShortList(
        accountId: number | undefined, 
        subscribersShowingAmount: number, 
        isRandomSubscribers: boolean = false
    ) {
        if (!accountId)
            return of(undefined);

        return this.getRandomPageNumber(accountId).pipe(
            switchMap(randomPageNumber => {
                return this.http.get<Pagable<Profile>>(`${this.accountApiUrl}/subscribers/${accountId}?page=${randomPageNumber}`)
                    .pipe(map(val => {
                        let subscribers = [...val.items];

                        if (isRandomSubscribers) {
                            subscribers = this.getRandomItemsFromArray(subscribers);
                        }

                        subscribers = this.getShortList(subscribers, subscribersShowingAmount);

                        return subscribers;
                    }))
            })
        );
    }

    getAllSubscribers(accountId: number | undefined) {
        return this.http.get<Pagable<Profile[]>>(`${this.accountApiUrl}/subscribers/${accountId}`);
    }

    patchProfile(profile: Partial<Profile>) {
        return this.http.patch<Profile>(
            `${this.accountApiUrl}/me`, 
            profile
        );
    }

    uploadAvatar(avatarFile: File) {
        const fd = new FormData();
        fd.append('image', avatarFile);

        return this.http.post<Profile>(
            `${this.accountApiUrl}/upload_image`,
            fd
        );
    }

    filterProfiles(params: Record<string, any>) {
        return this.http.get<Pagable<Profile>>(
            `${this.accountApiUrl}/accounts`,
            { params }
        ).pipe(
            tap(res => this.filteredProfiles.set(res.items))
        );
    }

    getRandomPageNumber(accountId: number) {
        return this.http.get<Pagable<Profile>>(`${this.accountApiUrl}/subscribers/${accountId}`)
            .pipe(
                map(val => this.getRandomNumberFromInterval(1, val.pages))
            );
    }


    private getRandomNumberFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private getRandomItemsFromArray(arr: any[]) {
        return arr.sort(() => 0.5 - Math.random());
    }

    private getShortList(arr: any[], showingElementsAmount: number) {
        return arr.slice(0, showingElementsAmount);
    }
}
