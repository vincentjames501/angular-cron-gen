export interface CronOptions {
    formInputClass: string;
    formSelectClass: string;
    formRadioClass: string;
    formCheckboxClass: string;

    defaultTime: string,

    hideMinutesTab: boolean;
    hideHourlyTab: boolean;
    hideDailyTab: boolean;
    hideWeeklyTab: boolean;
    hideMonthlyTab: boolean;
    hideYearlyTab: boolean;
    hideAdvancedTab: boolean;
    use24HourTime: boolean;
    hideSeconds: boolean;
}
