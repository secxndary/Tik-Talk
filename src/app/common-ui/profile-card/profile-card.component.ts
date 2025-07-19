import { Component, Input } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { AvatarPlaceholderComponent } from "../avatar-placeholder/avatar-placeholder.component";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-profile-card',
    imports: [AvatarPlaceholderComponent, RouterLink],
    templateUrl: './profile-card.component.html',
    styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
    @Input() profile!: Profile;
}
