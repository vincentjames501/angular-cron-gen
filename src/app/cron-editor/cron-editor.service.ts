export class CronGenService {
    public displayNumber(number: number) {
        const value = `${number}`;
        if (value.length > 1) {
            const secondToLastDigit = value.charAt(value.length - 2);
            if (secondToLastDigit === "1") {
                return "th";
            }
        }

        const lastDigit = value.charAt(value.length - 1);
        switch (lastDigit) {
            case "1":
                return "st";
            case "2":
                return "nd";
            case "3":
                return "rd";
            default:
                return "th";
        }
    }

    public range(start: number, end: number): number[] {
        const length = end - start + 1;
        return Array.apply(null, Array(length)).map((_, i) => i + start);
    }

    public selectOptions() {
        return {
            months: this.range(1, 13),
            monthWeeks: ["#1", "#2", "#3", "#4", "#5", "L"],
            days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
            minutes: this.range(0, 59),
            fullMinutes: this.range(0, 59),
            seconds: this.range(0, 59),
            hours: this.range(1, 23),
            monthDays: this.range(1, 31),
            monthDaysWithLasts: ["1W", ...[...this.range(1, 31).map(item => item.toString())], "LW", "L"],
            hourTypes: ["AM", "PM"]
        };
    }
}
