import { Pipe, PipeTransform } from "@angular/core";
import { DateTime, Interval } from "luxon";

@Pipe({
    name: 'relativeDateTime'
})
export class RelativeDateTimePipe implements PipeTransform {
    transform(value: string | null) {
        if (!value)
            return null;

        const date = DateTime.fromISO(value)

        return date.plus({ hours: 3 }).toRelative();
    }
}