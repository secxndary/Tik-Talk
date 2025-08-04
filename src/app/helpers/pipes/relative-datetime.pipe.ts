import { Pipe, PipeTransform } from "@angular/core";
import { DateTime } from "luxon";

@Pipe({
    name: 'relativeDateTime'
})
export class RelativeDateTimePipe implements PipeTransform {
    transform(value: string | null) {
        if (!value) {
            return null;
        }

        const date = DateTime.fromISO(value).setLocale('ru-RU');;
        const dateInGmtPlus3 = date.plus({ hours: 3 });

        if (dateInGmtPlus3.diffNow('days').days > -4) {
            return dateInGmtPlus3.toRelative();
        }

        if (dateInGmtPlus3.diffNow('years').years <= -1) {
            return dateInGmtPlus3.toFormat('d MMMM yyyy в HH:mm');
        }

        return dateInGmtPlus3.toFormat('d MMMM в HH:mm');
    }
}