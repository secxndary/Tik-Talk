import { Component, Input } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { ProfileNamePipe } from "../../helpers/pipes/profile-name.pipe";

@Component({
    selector: 'app-avatar-placeholder',
    templateUrl: 'avatar-placeholder.component.html',
    styleUrl: 'avatar-placeholder.component.scss',
    imports: [ImgUrlPipe, ProfileNamePipe]
})
export class AvatarPlaceholderComponent {
    boringAvatarsApi = 'https://hostedboringavatars.vercel.app/api';
    avatarType = 'marble';

    @Input() class = '';
    @Input() profile: Profile | undefined = undefined;

    get avatarUrl(): string {
        if (this.profile && this.profile.avatarUrl){
            return this.profile.avatarUrl;
        }

        const profileUniqueProperty = this.profile?.id;

        return `${this.boringAvatarsApi}/${this.avatarType}?name=${profileUniqueProperty}`;
    }
}