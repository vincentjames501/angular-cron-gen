import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter } from "@angular/core";

import { CronGenService } from "./cron-editor.service";
import { ICronOptions } from "./ICronOptions";
import { DAY_LOOKUPS, MONTH_WEEK_LOOKUPS, MONTH_LOOKUPS, States } from "./enums";

@Component({
    selector: "cron-editor",
    template: require("./cron-editor.template.html"),
    styleUrls: ['./cron-editor.component.css']
})
export class CronGenComponent implements OnInit, OnChanges {
    @Input() public disabled: boolean;
    @Input() public options: ICronOptions;

    @Input() get cron(): string { return this._cron; }
    set cron(value: string) {
        this._cron = value;
        this.cronChange.emit(this._cron);
    }

    // the name is an Angular convention, @Input variable name + "Change" suffix
    @Output() cronChange = new EventEmitter();

    public activeTab: string;
    public selectOptions: any; // TODO: refactor this
    public state: any; // TODO: refactor this

    private _cron: string;
    private currentState: number = States.INIT;

    constructor(public cronGenService: CronGenService) {
    }

    public async ngOnInit() {
        this.selectOptions = this.cronGenService.selectOptions();
        this.state = this.getDefaultState();

        this.handleModelChange(this.cron);
    }

    public async ngOnChanges(changes: SimpleChanges) {
        const newCron = changes["cron"];
        if (newCron && !newCron.firstChange) {
            this.handleModelChange(this.cron);
        }
    }

    public setActiveTab(tab: string) {
        if (!this.disabled) {
            this.activeTab = tab;
            this.regenerateCron();
        }
    }

    public dayDisplay(day: string): string {
        return DAY_LOOKUPS[day];
    }

    public monthWeekDisplay(monthWeekNumber: number): string {
        return MONTH_WEEK_LOOKUPS[monthWeekNumber];
    }

    public monthDisplay(month: number): string {
        return MONTH_LOOKUPS[month];
    }

    public monthDayDisplay(monthDay: string): string {
        if (monthDay === "L") {
            return "Last Day";
        } else if (monthDay === "LW") {
            return "Last Weekday";
        } else if (monthDay === "1W") {
            return "First Weekday";
        } else {
            return `${monthDay}${this.cronGenService.displayNumber(+monthDay)} day`;
        }
    }

    public regenerateCron() {
        this.currentState = States.DIRTY;
        switch (this.activeTab) {
            case "minutes":
                this.cron = `${this.state.minutes.seconds} 0/${this.state.minutes.minutes} * 1/1 * ? *`;
                break;
            case "hourly":
                this.cron = `${this.state.hourly.seconds} ${this.state.hourly.minutes} 0/${this.state.hourly.hours} 1/1 * ? *`;
                break;
            case "daily":
                switch (this.state.daily.subTab) {
                    case "everyDays":
                        this.cron = `${this.state.daily.everyDays.seconds} ${this.state.daily.everyDays.minutes} ${this.hourToCron(this.state.daily.everyDays.hours, this.state.daily.everyDays.hourType)} 1/${this.state.daily.everyDays.days} * ? *`;
                        break;
                    case "everyWeekDay":
                        this.cron = `${this.state.daily.everyWeekDay.seconds} ${this.state.daily.everyWeekDay.minutes} ${this.hourToCron(this.state.daily.everyWeekDay.hours, this.state.daily.everyWeekDay.hourType)} ? * MON-FRI *`;
                        break;
                    default:
                        throw "Invalid cron daily subtab selection";
                }
                break;
            case "weekly":
                const days = this.selectOptions.days
                    .reduce((acc, day) => this.state.weekly[day] ? acc.concat([day]) : acc, [])
                    .join(",");
                this.cron = `${this.state.weekly.seconds} ${this.state.weekly.minutes} ${this.hourToCron(this.state.weekly.hours, this.state.weekly.hourType)} ? * ${days} *`;
                break;
            case "monthly":
                switch (this.state.monthly.subTab) {
                    case "specificDay":
                        this.cron = `${this.state.monthly.specificDay.seconds} ${this.state.monthly.specificDay.minutes} ${this.hourToCron(this.state.monthly.specificDay.hours, this.state.monthly.specificDay.hourType)} ${this.state.monthly.specificDay.day} 1/${this.state.monthly.specificDay.months} ? *`;
                        break;
                    case "specificWeekDay":
                        this.cron = `${this.state.monthly.specificWeekDay.seconds} ${this.state.monthly.specificWeekDay.minutes} ${this.hourToCron(this.state.monthly.specificWeekDay.hours, this.state.monthly.specificWeekDay.hourType)} ? 1/${this.state.monthly.specificWeekDay.months} ${this.state.monthly.specificWeekDay.day}${this.state.monthly.specificWeekDay.monthWeek} *`;
                        break;
                    default:
                        throw "Invalid cron monthly subtab selection";
                }
                break;
            case "yearly":
                switch (this.state.yearly.subTab) {
                    case "specificMonthDay":
                        this.cron = `${this.state.yearly.specificMonthDay.seconds} ${this.state.yearly.specificMonthDay.minutes} ${this.hourToCron(this.state.yearly.specificMonthDay.hours, this.state.yearly.specificMonthDay.hourType)} ${this.state.yearly.specificMonthDay.day} ${this.state.yearly.specificMonthDay.month} ? *`;
                        break;
                    case "specificMonthWeek":
                        this.cron = `${this.state.yearly.specificMonthWeek.seconds} ${this.state.yearly.specificMonthWeek.minutes} ${this.hourToCron(this.state.yearly.specificMonthWeek.hours, this.state.yearly.specificMonthWeek.hourType)} ? ${this.state.yearly.specificMonthWeek.month} ${this.state.yearly.specificMonthWeek.day}${this.state.yearly.specificMonthWeek.monthWeek} *`;
                        break;
                    default:
                        throw "Invalid cron yearly subtab selection";
                }
                break;
            case "advanced":
                this.cron = this.state.advanced.expression;
                break;
            default:
                throw "Invalid cron active tab selection";
        }
    }

    private processHour(hours: number) {
        if (this.options.use24HourTime) {
            return hours;
        } else {
            return ((hours + 11) % 12 + 1);
        }
    }

    private getHourType(hours: number) {
        return this.options.use24HourTime ? null : (hours >= 12 ? "PM" : "AM");
    }

    private hourToCron(hour, hourType) {
        if (this.options.use24HourTime) {
            return hour;
        } else {
            return hourType === "AM" ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
        }
    }

    public handleModelChange(cron: string) {
        if (this.currentState === States.DIRTY) {
            this.currentState = States.CLEAN;
            return;
        } else {
            this.currentState = States.CLEAN;
        }

        const cronParts = cron.split(" ");
        if (cronParts.length === 6 || cronParts.length === 7) {
            const [seconds, minutes, hours, dayOfMonth, month, dayOfWeek] = cronParts;

            if (cron.match(/\d+ 0\/\d+ \* 1\/1 \* \? \*/)) {
                this.activeTab = "minutes";

                this.state.minutes.minutes = parseInt(minutes.substring(2));
                this.state.minutes.seconds = parseInt(seconds);
            } else if (cron.match(/\d+ \d+ 0\/\d+ 1\/1 \* \? \*/)) {
                this.activeTab = "hourly";

                this.state.hourly.hours = parseInt(hours.substring(2));
                this.state.hourly.minutes = parseInt(minutes);
                this.state.hourly.seconds = parseInt(seconds);
            } else if (cron.match(/\d+ \d+ \d+ 1\/\d+ \* \? \*/)) {
                this.activeTab = "daily";

                this.state.daily.subTab = "everyDays";
                this.state.daily.everyDays.days = parseInt(dayOfMonth.substring(2));
                const parsedHours = parseInt(hours);
                this.state.daily.everyDays.hours = this.processHour(parsedHours);
                this.state.daily.everyDays.hourType = this.getHourType(parsedHours);
                this.state.daily.everyDays.minutes = parseInt(minutes);
                this.state.daily.everyDays.seconds = parseInt(seconds);
            } else if (cron.match(/\d+ \d+ \d+ \? \* MON-FRI \*/)) {
                this.activeTab = "daily";

                this.state.daily.subTab = "everyWeekDay";
                const parsedHours = parseInt(hours);
                this.state.daily.everyWeekDay.hours = this.processHour(parsedHours);
                this.state.daily.everyWeekDay.hourType = this.getHourType(parsedHours);
                this.state.daily.everyWeekDay.minutes = parseInt(minutes);
                this.state.daily.everyWeekDay.seconds = parseInt(seconds);
            } else if (cron.match(/\d+ \d+ \d+ \? \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
                this.activeTab = "weekly";
                this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
                dayOfWeek.split(",").forEach(weekDay => this.state.weekly[weekDay] = true);
                const parsedHours = parseInt(hours);
                this.state.weekly.hours = this.processHour(parsedHours);
                this.state.weekly.hourType = this.getHourType(parsedHours);
                this.state.weekly.minutes = parseInt(minutes);
                this.state.weekly.seconds = parseInt(seconds);
            } else if (cron.match(/\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ \? \*/)) {
                this.activeTab = "monthly";
                this.state.monthly.subTab = "specificDay";
                this.state.monthly.specificDay.day = dayOfMonth;
                this.state.monthly.specificDay.months = parseInt(month.substring(2));
                const parsedHours = parseInt(hours);
                this.state.monthly.specificDay.hours = this.processHour(parsedHours);
                this.state.monthly.specificDay.hourType = this.getHourType(parsedHours);
                this.state.monthly.specificDay.minutes = parseInt(minutes);
                this.state.monthly.specificDay.seconds = parseInt(seconds);
            } else if (cron.match(/\d+ \d+ \d+ \? 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
                const day = dayOfWeek.substr(0, 3);
                const monthWeek = dayOfWeek.substr(3);
                this.activeTab = "monthly";
                this.state.monthly.subTab = "specificWeekDay";
                this.state.monthly.specificWeekDay.monthWeek = monthWeek;
                this.state.monthly.specificWeekDay.day = day;
                this.state.monthly.specificWeekDay.months = parseInt(month.substring(2));
                const parsedHours = parseInt(hours);
                this.state.monthly.specificWeekDay.hours = this.processHour(parsedHours);
                this.state.monthly.specificWeekDay.hourType = this.getHourType(parsedHours);
                this.state.monthly.specificWeekDay.minutes = parseInt(minutes);
                this.state.monthly.specificWeekDay.seconds = parseInt(seconds);
            } else if (cron.match(/\d+ \d+ \d+ (\d+|L|LW|1W) \d+ \? \*/)) {
                this.activeTab = "yearly";
                this.state.yearly.subTab = "specificMonthDay";
                this.state.yearly.specificMonthDay.month = parseInt(month);
                this.state.yearly.specificMonthDay.day = dayOfMonth;
                const parsedHours = parseInt(hours);
                this.state.yearly.specificMonthDay.hours = this.processHour(parsedHours);
                this.state.yearly.specificMonthDay.hourType = this.getHourType(parsedHours);
                this.state.yearly.specificMonthDay.minutes = parseInt(minutes);
                this.state.yearly.specificMonthDay.seconds = parseInt(seconds);
            } else if (cron.match(/\d+ \d+ \d+ \? \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
                const day = dayOfWeek.substr(0, 3);
                const monthWeek = dayOfWeek.substr(3);
                this.activeTab = "yearly";
                this.state.yearly.subTab = "specificMonthWeek";
                this.state.yearly.specificMonthWeek.monthWeek = monthWeek;
                this.state.yearly.specificMonthWeek.day = day;
                this.state.yearly.specificMonthWeek.month = parseInt(month);
                const parsedHours = parseInt(hours);
                this.state.yearly.specificMonthWeek.hours = this.processHour(parsedHours);
                this.state.yearly.specificMonthWeek.hourType = this.getHourType(parsedHours);
                this.state.yearly.specificMonthWeek.minutes = parseInt(minutes);
                this.state.yearly.specificMonthWeek.seconds = parseInt(seconds);
            } else {
                this.activeTab = "advanced";
                this.state.advanced.expression = cron;
            }
        } else {
            throw "Unsupported cron expression. Expression must be 6 or 7 segments";
        }
    }

    private getDefaultState() {
        return {
            minutes: {
                minutes: 1,
                seconds: 0
            },
            hourly: {
                hours: 1,
                minutes: 0,
                seconds: 0
            },
            daily: {
                subTab: "everyDays",
                everyDays: {
                    days: 1,
                    hours: this.options.use24HourTime ? 0 : 1,
                    minutes: 0,
                    seconds: 0,
                    hourType: this.options.use24HourTime ? null : "AM"
                },
                everyWeekDay: {
                    hours: this.options.use24HourTime ? 0 : 1,
                    minutes: 0,
                    seconds: 0,
                    hourType: this.options.use24HourTime ? null : "AM"
                }
            },
            weekly: {
                MON: true,
                TUE: false,
                WED: false,
                THU: false,
                FRI: false,
                SAT: false,
                SUN: false,
                hours: this.options.use24HourTime ? 0 : 1,
                minutes: 0,
                seconds: 0,
                hourType: this.options.use24HourTime ? null : "AM"
            },
            monthly: {
                subTab: "specificDay",
                specificDay: {
                    day: 1,
                    months: 1,
                    hours: this.options.use24HourTime ? 0 : 1,
                    minutes: 0,
                    seconds: 0,
                    hourType: this.options.use24HourTime ? null : "AM"
                },
                specificWeekDay: {
                    monthWeek: "#1",
                    day: "MON",
                    months: 1,
                    hours: this.options.use24HourTime ? 0 : 1,
                    minutes: 0,
                    seconds: 0,
                    hourType: this.options.use24HourTime ? null : "AM"
                }
            },
            yearly: {
                subTab: "specificMonthDay",
                specificMonthDay: {
                    month: 1,
                    day: "1",
                    hours: this.options.use24HourTime ? 0 : 1,
                    minutes: 0,
                    seconds: 0,
                    hourType: this.options.use24HourTime ? null : "AM"
                },
                specificMonthWeek: {
                    monthWeek: "#1",
                    day: "MON",
                    month: 1,
                    hours: this.options.use24HourTime ? 0 : 1,
                    minutes: 0,
                    seconds: 0,
                    hourType: this.options.use24HourTime ? null : "AM"
                }
            },
            advanced: {
                expression: "0 15 10 L-2 * ?"
            }
        };
    }
}
