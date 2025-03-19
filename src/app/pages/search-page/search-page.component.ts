import { Component, inject } from '@angular/core';
import { ProfileService } from '../../data/services/profile.service';
import { FormsModule } from '@angular/forms';
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component';
import { ProfileFiltersComponent } from "./profile-filters/profile-filters.component";

@Component({
    selector: 'app-search-page',
    imports: [ProfileCardComponent, FormsModule, ProfileFiltersComponent],
    templateUrl: './search-page.component.html',
    styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
    profileService = inject(ProfileService);

    profiles = this.profileService.filteredProfiles;
}
