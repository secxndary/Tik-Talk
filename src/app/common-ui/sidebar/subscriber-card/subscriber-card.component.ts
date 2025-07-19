import { Component, Input } from '@angular/core';
import { Profile } from '../../../data/interfaces/profile.interface';
import { RouterLink } from '@angular/router';
import { AvatarPlaceholderComponent } from "../../avatar-placeholder/avatar-placeholder.component";

@Component({
    selector: 'app-subscriber-card',
    imports: [RouterLink, AvatarPlaceholderComponent],
    templateUrl: './subscriber-card.component.html',
    styleUrl: './subscriber-card.component.scss'
})
export class SubscriberCardComponent {
    @Input() profile!: Profile;
}
