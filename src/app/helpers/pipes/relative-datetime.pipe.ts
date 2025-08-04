import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { DateTime } from "luxon";
import { interval, Subscription } from "rxjs";

@Pipe({
    name: 'relativeDateTime',
    pure: false
})
export class RelativeDateTimePipe implements PipeTransform, OnDestroy {
    private subscription?: Subscription;
    private currentValue: string | null = null;

    constructor(private cdRef: ChangeDetectorRef) { }

    transform(value: string | null) {
        if (!value) {
            this.cleanup();
            return null;
        }

        this.currentValue = this.formatDateTime(value);
        this.setupAutoRefresh(value);

        return this.currentValue;
    }

    ngOnDestroy() {
        this.cleanup();
    }


    private formatDateTime(dateString: string) {
        const { localDate, now } = this.getDatesWithTimezones(dateString);

        const diffInSeconds = now.diff(localDate, 'seconds').seconds;
        const startOfToday = now.startOf('day');
        const startOfYesterday = startOfToday.minus({ days: 1 });
        const startOfDayBeforeYesterday = startOfToday.minus({ days: 2 });
        const startOfThisYear = now.startOf('year');

        if (diffInSeconds < 3)
            return 'только что';

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

    private setupAutoRefresh(dateString: string) {
        this.cleanup();

        const { localDate, now } = this.getDatesWithTimezones(dateString);
        const diffInSeconds = now.diff(localDate, 'seconds').seconds;
        const diffInMinutes = now.diff(localDate, 'minutes').minutes;

        const minUpdateIntervalForSeconds = 3000;
        const maxUpdateIntervalForSeconds = 6000;
        const minUpdateIntervalForMinutes = 1000 * 55;
        const maxUpdateIntervalForMinutes = 1000 * 65;

        if (diffInSeconds < 60) {
            this.subscription = interval(
                this.getRandomUpdateValueInMilliseconds(minUpdateIntervalForSeconds, maxUpdateIntervalForSeconds)
            )
                .subscribe(() => {
                    this.currentValue = this.formatDateTime(dateString);
                    this.cdRef.markForCheck();
                })
        }

        if (diffInMinutes > 1 && diffInMinutes < 60) {
            this.subscription = interval(
                this.getRandomUpdateValueInMilliseconds(minUpdateIntervalForMinutes, maxUpdateIntervalForMinutes)
            )
                .subscribe(() => {
                    this.currentValue = this.formatDateTime(dateString);
                    this.cdRef.markForCheck();
                })
        }
    }

    private cleanup() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    }

    private getDatesWithTimezones(dateString: string): { localDate: DateTime, now: DateTime } {
        const utcDate = DateTime.fromISO(dateString, { zone: 'UTC', locale: 'ru-RU' });
        const localDate = utcDate.setZone('system');
        const now = DateTime.now().setZone(localDate.zoneName ? localDate.zoneName : 'Europe/Moscow');

        return { localDate, now };
    }

    private getRandomUpdateValueInMilliseconds(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}