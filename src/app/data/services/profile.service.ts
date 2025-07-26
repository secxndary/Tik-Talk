import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Profile } from '../interfaces/profile.interface';
import { Pagable } from '../interfaces/pagable.interface';
import { map, of, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    baseApiUrl = 'https://icherniakov.ru/yt-course';
    accountApiUrl = `${this.baseApiUrl}/account`;

    http = inject(HttpClient);

    me = signal<Profile | null>(null);
    filteredProfiles = signal<Profile[]>([]);

    getTestAccounts() {
        return this.http.get<Profile[]>(`${this.accountApiUrl}/test_accounts`);
    }

    getMySubscribers() {
        return this.http.get<Pagable<Profile[]>>(`${this.accountApiUrl}/subscribers/`);
    }

    getMySubscribersShortList(
        subscribersShowingAmount: number = 6, 
        isRandomSubscribers: boolean = false
    ) {
        return this.getMySubscribers()
            .pipe(
                map(val => { 
                    return val.items = this.getShortList(val.items, subscribersShowingAmount, isRandomSubscribers);
                })
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
        subscribersShowingAmount: number = 6, 
        isRandomSubscribers: boolean = false
    ) {
        if (!accountId)
            return of(undefined);

        const endpoint = `${this.accountApiUrl}/subscribers/${accountId}`;

        return this.getRandomElementsFromRandomPage<Profile>(endpoint, isRandomSubscribers)
            .pipe(
                map(subscribers => this.getShortList(subscribers, subscribersShowingAmount, isRandomSubscribers))
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


    private getRandomElementsFromRandomPage<T>(endpoint: string, isRandomItems: boolean = false) {
        return this.getRandomPageNumber(endpoint)
            .pipe(switchMap(randomPageNumber => {
                return this.http.get<Pagable<T>>(
                    endpoint,
                    {
                        params: {
                            page: randomPageNumber
                        }
                    })
                    .pipe(map(val => {
                        let items = [...val.items];

                        if (isRandomItems) {
                            items = this.getRandomItemsFromArray(items);
                        }

                        return items;
                    }));
            }));
    }

    private getRandomPageNumber(endpoint: string) {
        return this.http.get<Pagable<Profile>>(endpoint)
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

    private getShortList(arr: any[], showingElementsAmount: number, isRandomItems = false) {
        let items = [...arr];

        if (isRandomItems)
            items = this.getRandomItemsFromArray(items);

        return items.slice(0, showingElementsAmount);
    }
}
