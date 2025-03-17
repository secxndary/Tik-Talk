import { Component, inject } from '@angular/core';
import { ProfileService } from '../../data/services/profile.service';
import { Profile } from '../../data/interfaces/profile.interface';
import { FormsModule } from '@angular/forms';
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component';

@Component({
    selector: 'app-search-page',
    imports: [ProfileCardComponent, FormsModule],
    templateUrl: './search-page.component.html',
    styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {

    profileService = inject(ProfileService);

    profiles: Profile[] = [];

    constructor() {
        this.profileService.getTestAccounts()
            .subscribe(val => {
                this.profiles = val;
            });
    }
}
