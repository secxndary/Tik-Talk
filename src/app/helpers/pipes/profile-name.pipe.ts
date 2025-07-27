import { Pipe, PipeTransform } from "@angular/core";
import { Profile } from "../../data/interfaces/profile.interface";

@Pipe({
    name: 'profileName'
})
export class ProfileNamePipe implements PipeTransform {
    transform(profile: Profile | null) {
        if (!profile) {
            return null;
        }

        return profile.firstName && profile.lastName
            ? (profile.firstName + ' ' + profile.lastName)?.trimStart().trimEnd()
            : profile.username?.trimStart().trimEnd();
    }
}