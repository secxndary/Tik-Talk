import { Component, inject, Renderer2 } from '@angular/core';
import { AvatarPlaceholderComponent } from "../../../common-ui/avatar-placeholder/avatar-placeholder.component";
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { ProfileService } from '../../../data/services/profile.service';

@Component({
    selector: 'app-post-input',
    imports: [AvatarPlaceholderComponent, SvgIconComponent],
    templateUrl: './post-input.component.html',
    styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
    r2 = inject(Renderer2);
    profile = inject(ProfileService).me();

    onTextAreaInput(event: Event) {
        const textarea = event.target as HTMLTextAreaElement;

        this.r2.setStyle(textarea, 'height', 'auto');
        this.r2.setStyle(textarea, 'height', `${textarea.scrollHeight}px`);
    }
}
