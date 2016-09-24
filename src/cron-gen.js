(() => {

    const ACCEPTABLE_CRON_FORMATS = ['quartz'];
    const DEFAULT_TEMPLATE = 'angular-cron-gen/cron-gen.html';
    const DAY_LOOKUPS = {
        'SUN': 'Sunday',
        'MON': 'Monday',
        'TUE': 'Tuesday',
        'WED': 'Wednesday',
        'THU': 'Thursday',
        'FRI': 'Friday',
        'SAT': 'Saturday'
    };
    const MONTH_WEEK_LOOKUPS = {
        '1': 'First',
        '2': 'Second',
        '3': 'Third',
        '4': 'Fourth'
    };
    const MONTH_LOOKUPS = {
        '1': 'January',
        '2': 'February',
        '3': 'March',
        '4': 'April',
        '5': 'May',
        '6': 'June',
        '7': 'July',
        '8': 'August',
        '9': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    };
    const States = {
        INIT: Symbol('INIT'),
        DIRTY: Symbol('DIRTY'),
        CLEAN: Symbol('CLEAN'),
    };

    angular.module('angular-cron-gen', [])
        .directive('cronGen', ['$timeout', '$templateRequest', '$sce', '$compile', '$log', ($timeout, $templateRequest, $sce, $compile, $log) => ({
            scope: {
                ngModel: '=',
                ngDisabled: '=',
                options: '='
            },
            require: ['ngModel', '?ngDisabled'],
            replace: true,
            restrict: 'E',
            link($scope, elem) {
                //Define our directive state
                const state = $scope.state = {
                    state: States.INIT,
                    activeTab: 'minutes',
                    minutes: {
                        minutes: 1
                    },
                    hourly: {
                        subTab: 'every',
                        every: {
                            hours: 1
                        },
                        specific: {
                            hours: 0,
                            minutes: 0
                        }
                    },
                    daily: {
                        subTab: 'everyDays',
                        everyDays: {
                            days: 1
                        },
                        hours: 0,
                        minutes: 0
                    },
                    weekly: {
                        MON: true,
                        TUE: false,
                        WED: false,
                        THU: false,
                        FRI: false,
                        SAT: false,
                        SUN: false,
                        hours: 0,
                        minutes: 0
                    },
                    monthly: {
                        subTab: 'specificDay',
                        specificDay: {
                            day: 1,
                            months: 1
                        },
                        specificWeekDay: {
                            monthWeek: 1,
                            day: 'MON',
                            months: 1
                        },
                        hours: 0,
                        minutes: 0
                    },
                    yearly: {
                        subTab: 'specificMonthDay',
                        specificMonthDay: {
                            month: 1,
                            day: 1
                        },
                        specificMonthWeek: {
                            monthWeek: 1,
                            day: 'MON',
                            month: 1
                        },
                        hours: 0,
                        minutes: 0
                    },
                    advanced: {
                        expression: null
                    }
                };

                //Select options for ng-options
                const selectOptions = $scope.selectOptions = {
                    hours: [...new Array(24).keys()],
                    minutes: [...new Array(60).keys()],
                    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    monthWeeks: [1, 2, 3, 4],
                    days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
                };

                //Extract our options
                const {
                    options: {
                        templateUrl = DEFAULT_TEMPLATE,
                        cronFormat = 'quartz'
                    }
                } = $scope;

                //Handle tab navigation
                $scope.setActiveTab = ($event, state, tab, isDisabled) => {
                    $event.preventDefault();
                    state.activeTab = tab;
                    if (!isDisabled) {
                        regenerateCron(state);
                    }
                };

                //Validate our opts
                if (!ACCEPTABLE_CRON_FORMATS.includes(cronFormat)) {
                    throw `Desired cron format (${cronFormat}) is not available`;
                }
                if (!templateUrl) {
                    throw `Invalid template url (${templateUrl})`;
                }

                //Trust and fetch the requested template
                const trustedUrl = $sce.getTrustedResourceUrl(templateUrl);
                $templateRequest(trustedUrl)
                    .then(
                        template => elem.replaceWith($compile(template)($scope)),
                        error => $log.error('Failed to load requested template', error)
                    );

                //Utility Functions
                $scope.padNumber = (number) => `${number}`.length === 1 ? `0${number}` : `${number}`;
                $scope.dayDisplay = (day) => DAY_LOOKUPS[day];
                $scope.monthWeekDisplay = (monthWeekNumber) => MONTH_WEEK_LOOKUPS[monthWeekNumber];
                $scope.monthDisplay = (monthNumber) => MONTH_LOOKUPS[monthNumber];

                //On model changes, update our state to reflect the user's input
                $scope.$watch('ngModel', (cron) => {
                    state.advanced.expression = cron;

                    if (state.state === States.DIRTY) {
                        state.state = States.CLEAN;
                        return;
                    } else {
                        state.state = States.CLEAN;
                    }

                    const segments = cron.split(' ');
                    if (segments.length === 6 || segments.length === 7) {
                        const [, minutes, hours, dayOfMonth, month, dayOfWeek] = segments;
                        if (cron.match(/0 0\/\d+ \* 1\/1 \* \? \*/)) {
                            state.activeTab = 'minutes';
                            state.minutes.minutes = parseInt(minutes.substring(2));
                        } else if (cron.match(/0 0 0\/\d+ 1\/1 \* \? \*/)) {
                            state.activeTab = 'hourly';
                            state.hourly.subTab = 'every';
                            state.hourly.every.hours = parseInt(hours.substring(2));
                        } else if (cron.match(/0 \d+ \d+ 1\/1 \* \? \*/)) {
                            state.activeTab = 'hourly';
                            state.hourly.subTab = 'specific';
                            state.hourly.specific.hours = parseInt(hours);
                            state.hourly.specific.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ 1\/\d+ \* \? \*/)) {
                            state.activeTab = 'daily';
                            state.daily.subTab = 'everyDays';
                            state.daily.everyDays.days = parseInt(dayOfMonth.substring(2));
                            state.daily.hours = parseInt(hours);
                            state.daily.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \? \* MON\-FRI \*/)) {
                            state.activeTab = 'daily';
                            state.daily.subTab = 'everyWeekDay';
                            state.daily.hours = parseInt(hours);
                            state.daily.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \? \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
                            state.activeTab = 'weekly';
                            selectOptions.days.forEach(weekDay => state.weekly[weekDay] = false);
                            dayOfWeek.split(',').forEach(weekDay => state.weekly[weekDay] = true);
                            state.weekly.hours = parseInt(hours);
                            state.weekly.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \d+ 1\/\d+ \? \*/)) {
                            state.activeTab = 'monthly';
                            state.monthly.subTab = 'specificDay';
                            state.monthly.specificDay.day = parseInt(dayOfMonth);
                            state.monthly.specificDay.months = parseInt(month.substring(2));
                            state.monthly.hours = parseInt(hours);
                            state.monthly.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \? 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)#(1|2|3|4) \*/)) {
                            const [day, monthWeek] = dayOfWeek.split('#');
                            state.activeTab = 'monthly';
                            state.monthly.subTab = 'specificWeekDay';
                            state.monthly.specificWeekDay.monthWeek = parseInt(monthWeek);
                            state.monthly.specificWeekDay.day = day;
                            state.monthly.specificWeekDay.months = parseInt(month.substring(2));
                            state.monthly.hours = parseInt(hours);
                            state.monthly.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \d+ \d+ \? \*/)) {
                            state.activeTab = 'yearly';
                            state.yearly.subTab = 'specificMonthDay';
                            state.yearly.specificMonthDay.month = parseInt(month);
                            state.yearly.specificMonthDay.day = parseInt(dayOfMonth);
                            state.yearly.hours = parseInt(hours);
                            state.yearly.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \? \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)#(1|2|3|4) \*/)) {
                            const [day, monthWeek] = dayOfWeek.split('#');
                            state.activeTab = 'yearly';
                            state.yearly.subTab = 'specificMonthWeek';
                            state.yearly.specificMonthWeek.monthWeek = parseInt(monthWeek);
                            state.yearly.specificMonthWeek.day = day;
                            state.yearly.specificMonthWeek.month = parseInt(month);
                            state.yearly.hours = parseInt(hours);
                            state.yearly.minutes = parseInt(minutes);
                        } else {
                            state.activeTab = 'advanced';
                            state.advanced.expression = cron;
                        }
                    } else {
                        throw 'Unsupported cron expression. Expression must be 6 or 7 segments';
                    }
                });

                //On an input change, regenerate our cron/model
                const regenerateCron = $scope.regenerateCron = (state) => {
                    state.state = States.DIRTY;
                    switch (state.activeTab) {
                        case 'minutes':
                            $scope.ngModel = `0 0/${state.minutes.minutes} * 1/1 * ? *`;
                            break;
                        case 'hourly':
                            switch (state.hourly.subTab) {
                                case 'every':
                                    $scope.ngModel = `0 0 0/${state.hourly.every.hours} 1/1 * ? *`;
                                    break;
                                case 'specific':
                                    $scope.ngModel = `0 ${state.hourly.specific.minutes} ${state.hourly.specific.hours} 1/1 * ? *`;
                                    break;
                                default:
                                    throw 'Invalid cron hourly subtab selection';
                            }
                            break;
                        case 'daily':
                            switch (state.daily.subTab) {
                                case 'everyDays':
                                    $scope.ngModel = `0 ${state.daily.minutes} ${state.daily.hours} 1/${state.daily.everyDays.days} * ? *`;
                                    break;
                                case 'everyWeekDay':
                                    $scope.ngModel = `0 ${state.daily.minutes} ${state.daily.hours} ? * MON-FRI *`;
                                    break;
                                default:
                                    throw 'Invalid cron daily subtab selection';
                            }
                            break;
                        case 'weekly':
                            const days = selectOptions.days
                                .reduce((acc, day) => state.weekly[day] ? acc.concat([day]) : acc, [])
                                .join(',');
                            $scope.ngModel = `0 ${state.weekly.minutes} ${state.weekly.hours} ? * ${days} *`;
                            break;
                        case 'monthly':
                            switch (state.monthly.subTab) {
                                case 'specificDay':
                                    $scope.ngModel = `0 ${state.monthly.minutes} ${state.monthly.hours} ${state.monthly.specificDay.day} 1/${state.monthly.specificDay.months} ? *`;
                                    break;
                                case 'specificWeekDay':
                                    $scope.ngModel = `0 ${state.monthly.minutes} ${state.monthly.hours} ? 1/${state.monthly.specificWeekDay.months} ${state.monthly.specificWeekDay.day}#${state.monthly.specificWeekDay.monthWeek} *`;
                                    break;
                                default:
                                    throw 'Invalid cron monthly subtab selection';
                            }
                            break;
                        case 'yearly':
                            switch (state.yearly.subTab) {
                                case 'specificMonthDay':
                                    $scope.ngModel = `0 ${state.yearly.minutes} ${state.yearly.hours} ${state.yearly.specificMonthDay.day} ${state.yearly.specificMonthDay.month} ? *`;
                                    break;
                                case 'specificMonthWeek':
                                    $scope.ngModel = `0 ${state.yearly.minutes} ${state.yearly.hours} ? ${state.yearly.specificMonthWeek.month} ${state.yearly.specificMonthWeek.day}#${state.yearly.specificMonthWeek.monthWeek} *`;
                                    break;
                                default:
                                    throw 'Invalid cron yearly subtab selection';
                            }
                            break;
                        case 'advanced':
                            $scope.ngModel = state.advanced.expression;
                            break;
                        default:
                            throw 'Invalid cron active tab selection'
                    }
                };
            }
        })]);
})();