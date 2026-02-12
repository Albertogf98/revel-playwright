export class DateUtil {
    private today: Date;

    constructor() {
        this.today = new Date();
    }

    public get todayDate(): number {
        return this.today.getDate();
    }

    public setDate(newDate: number) {
        this.today.setDate(newDate);
    }

    public generateFormattedDate(
        options: { year?: number; month?: number; day?: number; timezoneOffsetMinutes?: number; date?: Date } = {},
    ): string {
        const year = options.year ?? this.today.getUTCFullYear();
        const month = options.month ?? this.today.getUTCMonth() + 1;
        const day = options.day ?? this.today.getUTCDate();
        const timezoneOffsetMinutes = options.timezoneOffsetMinutes ?? 60;

        const date = new Date(Date.UTC(year, month - 1, day, 9, 37, 16, 0));

        const offsetHours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60);
        const offsetMinutes = Math.abs(timezoneOffsetMinutes) % 60;
        const offsetSign = timezoneOffsetMinutes >= 0 ? '+' : '-';
        const timezoneString = `${offsetSign}${String(offsetHours).padStart(2, '0')}${String(offsetMinutes).padStart(2, '0')}`;

        const formattedDate = date.toISOString().replace('Z', '') + timezoneString;

        return formattedDate;
    }

    public dateIsBefore = (before: string, toCompare: string): boolean =>
        new Date(before).toISOString() <= new Date(toCompare).toISOString();

    public getTimestamp(): string {
        const zero = '0';
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, zero);
        const day = String(now.getDate()).padStart(2, zero);
        const hours = String(now.getHours()).padStart(2, zero);
        const minutes = String(now.getMinutes()).padStart(2, zero);
        const seconds = String(now.getSeconds()).padStart(2, zero);
        const milliseconds = String(now.getMilliseconds()).padStart(2 + 1, zero);

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds},${milliseconds}`;
    }

    public parseMilisToMinSec(mili: number): { min: number; sec: number } {
        const totalSeconds = Math.floor(mili / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return {
            min: minutes,
            sec: seconds,
        };
    }
}
