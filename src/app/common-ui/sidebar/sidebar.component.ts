import { Component, inject } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { AsyncPipe, NgForOf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from '../../data/services/profile.service';
import { SubscriberCardComponent } from "./subscriber-card/subscriber-card.component";
import { firstValueFrom } from 'rxjs';
import { ImgUrlPipe } from "../../helpers/pipes/img-url.pipe";

@Component({
    selector: 'app-sidebar',
    imports: [
        SvgIconComponent,
        NgForOf,
        RouterLink,
        AsyncPipe,
        SubscriberCardComponent,
        ImgUrlPipe,
        RouterLinkActive
],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    profileService = inject(ProfileService);

    subscribersShowingAmount = 5;
    isRandomSubscribers = true;

    subscribers$ = this.profileService.getMySubscribersShortList(this.subscribersShowingAmount, this.isRandomSubscribers);

    me = this.profileService.me;

    menuItems = [
        {
            label: 'Моя страница',
            icon: 'home',
            link: 'profile/me'
        },
        {
            label: 'Чаты',
            icon: 'chats',
            link: 'chats'
        },
        {
            label: 'Поиск',
            icon: 'search',
            link: 'search'
        }
    ]

    ngOnInit() {
        firstValueFrom(this.profileService.getMe());
    }
}
