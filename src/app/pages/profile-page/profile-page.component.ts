import { Component, inject, signal } from '@angular/core';
import { ProfileHeaderComponent } from "../../common-ui/profile-header/profile-header.component";
import { ProfileService } from '../../data/services/profile.service';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from "../../common-ui/svg-icon/svg-icon.component";
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
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

    profile$ = this.route.params
        .pipe(switchMap(({ id }) => {
            if (id === 'me')
                return this.me$;

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

    me$ = toObservable(this.profileService.me);
    subscribersAmount$ = this.profile$.pipe(map(val => val?.subscribersAmount));
}
