import { Component, inject, signal } from '@angular/core';
import { SvgIconComponent } from "../../../common-ui/svg-icon/svg-icon.component";
import { DndDirective } from '../../../common-ui/directives/dnd.directive';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../data/services/profile.service';

@Component({
    selector: 'app-avatar-upload',
    imports: [SvgIconComponent, DndDirective, FormsModule],
    templateUrl: './avatar-upload.component.html',
    styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {
    preview = signal<string | undefined>('/assets/images/avatar-placeholder.png');

    avatar: File | null = null;

    profileService = inject(ProfileService);

    fileBrowserHandler(event: Event) {
        // ?.[0] — зачем точка?
        const file = (event.target as HTMLInputElement)?.files?.[0];

        this.processFile(file);
    }

    onFileDropped(file: File) {
        this.processFile(file);
    }

    processFile(file: File | undefined) {
        if (!file || !file.type.match('image'))
            return;

        const reader = new FileReader();

        reader.onload = (event) => {
            this.preview.set(event.target?.result?.toString());
            console.log('this.preview.set(event.target?.result?.toString());')
            console.log(event.target)
        }

        reader.readAsDataURL(file);

        this.avatar = file;
    }
}
