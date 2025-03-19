import { Component, effect, inject, ViewChild } from '@angular/core';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../data/services/profile.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AvatarUploadComponent } from "./avatar-upload/avatar-upload.component";

@Component({
    selector: 'app-settings-page',
    imports: [ProfileHeaderComponent, ReactiveFormsModule, AvatarUploadComponent],
    templateUrl: './settings-page.component.html',
    styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
    fb = inject(FormBuilder);
    route = inject(ActivatedRoute);
    profileService = inject(ProfileService);

    @ViewChild(AvatarUploadComponent)
    avatarUploader!: AvatarUploadComponent;

    form = this.fb.group({
        firstName: [''],
        lastName: [''],
        username: [{ value: '', disabled: true }],
        password: [''],
        description: [''],
        stack: ['']
    });

    constructor() {
        // effect запускает коллбек каждый раз, когда меняется signal
        effect(() => {
            this.form.patchValue({
                ...this.profileService.me(),
                // @ts-ignore
                stack: this.mergeStack(this.profileService.me()?.stack)
            });

            console.log(this.form.value);
        })
    }

    onSave() {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid) {
            console.log(this.form.value)
            return;
        }

        if (this.avatarUploader.avatar)
            firstValueFrom(this.profileService.uploadAvatar(this.avatarUploader.avatar));

        // Зачем нужен firstValueFrom?
        // @ts-ignore
        firstValueFrom(this.profileService.patchProfile({
            ...this.form.value,
            // @ts-ignore
            stack: this.splitStack(this.form.value.stack)
        }));
    }


    splitStack(stack: string | null | string[] | undefined) : string[] {
        if (!stack)
            return [];

        if (Array.isArray(stack))
            return this.trimStartAndEndOfStringArray(stack);

        return this.trimStartAndEndOfStringArray(
            stack.split(',')
        );
    }

    mergeStack(stack: string | null | string[] | undefined) : string {
        if (!stack)
            return '';

        if (Array.isArray(stack))
            return this.trimStartAndEndOfStringArray(stack)
                    .join(',');

        return stack;
    }

    trimStartAndEndOfStringArray(arr: string[]) : string[] {
        return arr.map(elem => elem.trimStart().trimEnd());
    }
}
