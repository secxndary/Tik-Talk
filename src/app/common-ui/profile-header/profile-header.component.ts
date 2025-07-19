import { Component, input } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { AvatarPlaceholderComponent } from "../avatar-placeholder/avatar-placeholder.component";

@Component({
    selector: 'app-profile-header',
    imports: [AvatarPlaceholderComponent],
    templateUrl: './profile-header.component.html',
    styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
    profile = input<Profile>();
}
