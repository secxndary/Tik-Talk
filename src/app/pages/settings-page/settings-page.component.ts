import { Component, effect, inject } from '@angular/core';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../data/services/profile.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-settings-page',
    imports: [ProfileHeaderComponent, ReactiveFormsModule],
    templateUrl: './settings-page.component.html',
    styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
    fb = inject(FormBuilder);
    route = inject(ActivatedRoute);
    profileService = inject(ProfileService);

    constructor() {
        effect(() => {
            this.form.patchValue({
                ...this.profileService.me(),
                // @ts-ignore
                stack: this.mergeStack(this.profileService.me()?.stack)
            });

            console.log(this.form.value);
        })
    }

    form = this.fb.group({
        firstName: [''],
        lastName: [''],
        username: [{ value: '', disabled: true }],
        password: [''],
        description: [''],
        stack: ['']
    })

    onSave() {
        console.log('onSave')

        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        console.log('before if')

        if (this.form.invalid) {
            console.log('invalid')
            console.log(this.form.value)
            return;
        }

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
            return stack;

        return stack.split(',');
    }

    mergeStack(stack: string | null | string[] | undefined) {
        if (!stack)
            return '';

        if (Array.isArray(stack))
            return stack.join(',');

        return stack;
    }
}
