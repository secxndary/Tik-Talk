import { Component, computed, inject, signal } from '@angular/core';
import { ProfileHeaderComponent } from "../../common-ui/profile-header/profile-header.component";
import { ProfileService } from '../../data/services/profile.service';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from "../../common-ui/svg-icon/svg-icon.component";
import { PostFeedComponent } from "./post-feed/post-feed.component";
import { AvatarPlaceholderComponent } from '../../common-ui/avatar-placeholder/avatar-placeholder.component';

@Component({
    selector: 'app-profile-page',
    imports: [
        RouterLink,
        AsyncPipe,
        ProfileHeaderComponent,
        SvgIconComponent,
        PostFeedComponent,
        AvatarPlaceholderComponent
    ],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
    profileService = inject(ProfileService);
    route = inject(ActivatedRoute);

    subscribersShowingAmount = 6;
    isSubscribersShortListRandom = true;

    profileId = signal<number | undefined>(undefined);
    profileId$ = toObservable(this.profileId);

    me$ = toObservable(this.profileService.me);
    meId = toSignal(this.me$.pipe(
        map(val => val?.id))
    );

    isCurrentPageMePage = computed(() => this.profileId() === this.meId());

    profile$ = this.route.params
        .pipe(switchMap(({ id }) => {
            if (id === 'me') {
                this.profileId.set(this.profileService.me()?.id);

                return this.me$;
            }

            const numericId = Number(id);
            this.profileId.set(numericId);

            return this.profileService.getAccount(numericId);
        }));

    subscribers$ = this.profileId$
        .pipe(switchMap(id => {
            if (!id)
                return of(null);

            return this.profileService.getAllSubscribers(id)
        }));

    subscribersShortList$ = this.profileId$
        .pipe(switchMap(id => {
            if (!id)
                return of(null);

            return this.profileService.getSubscribersShortList(
                this.profileId(),
                this.subscribersShowingAmount,
                this.isSubscribersShortListRandom
            );
        }));

    subscribersAmount$ = this.profile$.pipe(map(val => val?.subscribersAmount));
}
