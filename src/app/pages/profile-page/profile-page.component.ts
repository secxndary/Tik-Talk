import { Component, inject } from '@angular/core';
import { ProfileHeaderComponent } from "../../common-ui/profile-header/profile-header.component";
import { ProfileService } from '../../data/services/profile.service';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from "../../common-ui/svg-icon/svg-icon.component";
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { PostFeedComponent } from "./post-feed/post-feed.component";

@Component({
    selector: 'app-profile-page',
    imports: [
    RouterLink,
    AsyncPipe,
    ImgUrlPipe,
    ProfileHeaderComponent,
    SvgIconComponent,
    PostFeedComponent
],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
    profileService = inject(ProfileService);
    route = inject(ActivatedRoute);

    subscribersAmount = 6;

    me$ = toObservable(this.profileService.me);
    subscribers$ = this.profileService.getSubscribersShortList(this.subscribersAmount);

    // Объяснить код построчно
    profile$ = this.route.params
        .pipe(
            switchMap(({ id }) => {
                if (id === 'me')
                    return this.me$;

                return this.profileService.getAccount(id);
            })
        );
}
