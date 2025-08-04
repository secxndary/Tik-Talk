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

        const utcDate = DateTime.fromISO(value, { zone: 'UTC', locale: 'ru-RU' });
        const localDate = utcDate.setZone('system');
        const now = DateTime.now().setZone(localDate.zoneName ? localDate.zoneName : 'Europe/Moscow');

        const startOfToday = now.startOf('day');
        const startOfYesterday = startOfToday.minus({ days: 1 });
        const startOfDayBeforeYesterday = startOfToday.minus({ days: 2 });
        const startOfThisYear = now.startOf('year');

        if (localDate >= startOfToday) {
            return localDate.toRelative();
        }

        if (localDate >= startOfYesterday && localDate < startOfToday) {
            return localDate.toFormat('вчера в HH:mm');
        }

        if (localDate >= startOfDayBeforeYesterday && localDate < startOfYesterday) {
            return localDate.toFormat('позавчера в HH:mm');
        }

        if (localDate <= startOfThisYear) {
            return localDate.toFormat('d MMMM yyyy в HH:mm');
        }

        return localDate.toFormat('d MMMM в HH:mm');
    }
}