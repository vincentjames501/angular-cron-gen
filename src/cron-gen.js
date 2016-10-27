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
    const QUARTZ_REGEX = /^\s*($|#|\w+\s*=|(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?(?:,(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?)*)\s+(\?|\*|(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?(?:,(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?)*)\s+(\?|\*|(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\?|\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\s+(\?|\*|(?:[0-6])(?:(?:-|\/|\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\/|\,|#)(?:[0-6]))?(?:L)?)*|\?|\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\s)+(\?|\*|(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?(?:,(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?)*))$/;

    angular.module('angular-cron-gen', [])
        .factory('cronValidationService', () => ({
            isValid(cronFormat, expression) {
                const formattedExpression = expression.toUpperCase();
                switch (cronFormat) {
                    case 'quartz':
                        return !!formattedExpression.match(QUARTZ_REGEX);
                    default:
                        throw `Desired cron format (${cronFormat}) is not available`;
                }
            }
        }))
        .directive('cronGen', ['$templateRequest', '$sce', '$compile', '$log', 'cronValidationService', ($templateRequest, $sce, $compile, $log, cronValidationService) => ({
            scope: {
                ngModel: '=',
                ngDisabled: '=',
                options: '=',
                cronFormat: '@',
                templateUrl: '@',
                use24HourTime: '@'
            },
            require: ['ngModel', '?ngDisabled', '^?form'],
            replace: true,
            restrict: 'E',
            link($scope, elem, attrs, [ngModelCtrl,,formCtrl]) {
                //Extract our options
                const {
                    options: {
                        formInputClass = 'form-control-static',
                        formSelectClass = 'form-control-static',
                        formRadioClass = 'form-control-static',
                        hideMinutesTab = false,
                        hideHourlyTab = false,
                        hideDailyTab = false,
                        hideWeeklyTab = false,
                        hideMonthlyTab = false,
                        hideYearlyTab = false,
                        hideAdvancedTab = true,
                    } = {},
                    cronFormat = 'quartz',
                    templateUrl = DEFAULT_TEMPLATE,
                    use24HourTime = 'true'
                } = $scope;

                const showAs24HourTime = use24HourTime === 'true';

                //Define our directive state
                const state = $scope.state = {
                    use24HourTime: showAs24HourTime,
                    formInputClass,
                    formSelectClass,
                    formRadioClass,
                    state: States.INIT,
                    activeTab: (() => {
                        if (!hideMinutesTab) {
                            return 'minutes';
                        } else if (!hideHourlyTab) {
                            return 'hourly';
                        } else if (!hideDailyTab) {
                            return 'daily';
                        } else if (!hideWeeklyTab) {
                            return 'weekly';
                        } else if (!hideMonthlyTab) {
                            return 'monthly';
                        } else if (!hideYearlyTab) {
                            return 'yearly';
                        } else if (!hideAdvancedTab) {
                            return 'advanced';
                        }
                        throw 'No tabs available to make active';
                    })(),
                    minutes: {
                        isHidden: hideMinutesTab,
                        minutes: 1
                    },
                    hourly: {
                        isHidden: hideHourlyTab,
                        subTab: 'every',
                        every: {
                            hours: 1
                        },
                        specific: {
                            hours: showAs24HourTime ? 0 : 1,
                            minutes: 0,
                            hourType: showAs24HourTime ? null : 'AM'
                        }
                    },
                    daily: {
                        isHidden: hideDailyTab,
                        subTab: 'everyDays',
                        everyDays: {
                            days: 1
                        },
                        hours: showAs24HourTime ? 0 : 1,
                        minutes: 0,
                        hourType: showAs24HourTime ? null : 'AM'
                    },
                    weekly: {
                        isHidden: hideWeeklyTab,
                        MON: true,
                        TUE: false,
                        WED: false,
                        THU: false,
                        FRI: false,
                        SAT: false,
                        SUN: false,
                        hours: showAs24HourTime ? 0 : 1,
                        minutes: 0,
                        hourType: showAs24HourTime ? null : 'AM'
                    },
                    monthly: {
                        isHidden: hideMonthlyTab,
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
                        hours: showAs24HourTime ? 0 : 1,
                        minutes: 0,
                        hourType: showAs24HourTime ? null : 'AM'
                    },
                    yearly: {
                        isHidden: hideYearlyTab,
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
                        hours: showAs24HourTime ? 0 : 1,
                        minutes: 0,
                        hourType: showAs24HourTime ? null : 'AM'
                    },
                    advanced: {
                        isHidden: hideAdvancedTab,
                        expression: null
                    }
                };

                //Select options for ng-options
                const selectOptions = $scope.selectOptions = {
                    hours: state.use24HourTime ? [...new Array(24).keys()] : [...new Array(12).keys()].map(x => x + 1),
                    minutes: [...new Array(60).keys()],
                    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    monthWeeks: [1, 2, 3, 4],
                    days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                    hourTypes: ['AM', 'PM']
                };

                //If possible, add our cron expression validator to our form
                if (formCtrl && attrs.name) {
                    ngModelCtrl.$validators.testCronExpr = expression => cronValidationService.isValid(cronFormat, expression);
                }

                //Handle tab navigation
                $scope.setActiveTab = ($event, state, tab, isDisabled) => {
                    $event.preventDefault();
                    if (!isDisabled) {
                        state.activeTab = tab;
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

                function processHour(hours) {
                    if (state.use24HourTime) {
                        console.log(hours);
                        return hours;
                    } else {
                        return ((hours + 11) % 12 + 1);
                    }
                }

                function getHourType(hours) {
                    return state.use24HourTime ? null : (hours >= 12 ? 'PM' : 'AM');
                }

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
                            state.hourly.every.hours = processHour(parseInt(hours.substring(2)));
                        } else if (cron.match(/0 \d+ \d+ 1\/1 \* \? \*/)) {
                            state.activeTab = 'hourly';
                            state.hourly.subTab = 'specific';
                            const parsedHours = parseInt(hours);
                            state.hourly.specific.hours = processHour(parsedHours);
                            state.hourly.specific.hourType = getHourType(parsedHours);
                            state.hourly.specific.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ 1\/\d+ \* \? \*/)) {
                            state.activeTab = 'daily';
                            state.daily.subTab = 'everyDays';
                            state.daily.everyDays.days = parseInt(dayOfMonth.substring(2));
                            const parsedHours = parseInt(hours);
                            state.daily.hours = processHour(parsedHours);
                            state.daily.hourType = getHourType(parsedHours);
                            state.daily.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \? \* MON\-FRI \*/)) {
                            state.activeTab = 'daily';
                            state.daily.subTab = 'everyWeekDay';
                            const parsedHours = parseInt(hours);
                            state.daily.hours = processHour(parsedHours);
                            state.daily.hourType = getHourType(parsedHours);
                            state.daily.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \? \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
                            state.activeTab = 'weekly';
                            selectOptions.days.forEach(weekDay => state.weekly[weekDay] = false);
                            dayOfWeek.split(',').forEach(weekDay => state.weekly[weekDay] = true);
                            const parsedHours = parseInt(hours);
                            state.weekly.hours = processHour(parsedHours);
                            state.weekly.hourType = getHourType(parsedHours);
                            state.weekly.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \d+ 1\/\d+ \? \*/)) {
                            state.activeTab = 'monthly';
                            state.monthly.subTab = 'specificDay';
                            state.monthly.specificDay.day = parseInt(dayOfMonth);
                            state.monthly.specificDay.months = parseInt(month.substring(2));
                            const parsedHours = parseInt(hours);
                            state.monthly.hours = processHour(parsedHours);
                            state.monthly.hourType = getHourType(parsedHours);
                            state.monthly.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \? 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)#(1|2|3|4) \*/)) {
                            const [day, monthWeek] = dayOfWeek.split('#');
                            state.activeTab = 'monthly';
                            state.monthly.subTab = 'specificWeekDay';
                            state.monthly.specificWeekDay.monthWeek = parseInt(monthWeek);
                            state.monthly.specificWeekDay.day = day;
                            state.monthly.specificWeekDay.months = parseInt(month.substring(2));
                            const parsedHours = parseInt(hours);
                            state.monthly.hours = processHour(parsedHours);
                            state.monthly.hourType = getHourType(parsedHours);
                            state.monthly.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \d+ \d+ \? \*/)) {
                            state.activeTab = 'yearly';
                            state.yearly.subTab = 'specificMonthDay';
                            state.yearly.specificMonthDay.month = parseInt(month);
                            state.yearly.specificMonthDay.day = parseInt(dayOfMonth);
                            const parsedHours = parseInt(hours);
                            state.yearly.hours = processHour(parsedHours);
                            state.yearly.hourType = processHour(parsedHours);
                            state.yearly.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \? \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)#(1|2|3|4) \*/)) {
                            const [day, monthWeek] = dayOfWeek.split('#');
                            state.activeTab = 'yearly';
                            state.yearly.subTab = 'specificMonthWeek';
                            state.yearly.specificMonthWeek.monthWeek = parseInt(monthWeek);
                            state.yearly.specificMonthWeek.day = day;
                            state.yearly.specificMonthWeek.month = parseInt(month);
                            const parsedHours = parseInt(hours);
                            state.yearly.hours = processHour(parsedHours);
                            state.yearly.hourType = getHourType(parsedHours);
                            state.yearly.minutes = parseInt(minutes);
                        } else {
                            state.activeTab = 'advanced';
                            state.advanced.expression = cron;
                        }
                    } else {
                        throw 'Unsupported cron expression. Expression must be 6 or 7 segments';
                    }
                });

                function hourToCron(hour, hourType) {
                    console.log('hourToCron(' + hour + ',' + hourType + ')');
                    if (state.use24HourTime) {
                        return hour;
                    } else {
                        return hourType === 'AM' ? (hour === 12 ? 0 : hour) : (hour === 12 ? 23 : hour + 12);
                    }
                }

                // Watch for option changes
                $scope.$watch('options', ({
                    formInputClass = 'form-control-static',
                    formSelectClass = 'form-control-static',
                    formRadioClass = 'form-control-static',
                    hideMinutesTab = false,
                    hideHourlyTab = false,
                    hideDailyTab = false,
                    hideWeeklyTab = false,
                    hideMonthlyTab = false,
                    hideYearlyTab = false,
                    hideAdvancedTab = true,
                } = {}) => {
                    state.formInputClass = formInputClass;
                    state.formSelectClass = formSelectClass;
                    state.formRadioClass = formRadioClass;
                    state.minutes.isHidden = hideMinutesTab;
                    state.hourly.isHidden = hideHourlyTab;
                    state.daily.isHidden = hideDailyTab;
                    state.weekly.isHidden = hideWeeklyTab;
                    state.monthly.isHidden = hideMonthlyTab;
                    state.yearly.isHidden = hideYearlyTab;
                    state.advanced.isHidden = hideAdvancedTab;
                });

                //On an input change, regenerate our cron/model
                const regenerateCron = $scope.regenerateCron = (state) => {
                    console.log('regen');
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
                                    $scope.ngModel = `0 ${state.hourly.specific.minutes} ${hourToCron(state.hourly.specific.hours, state.hourly.specific.hourType)} 1/1 * ? *`;
                                    break;
                                default:
                                    throw 'Invalid cron hourly subtab selection';
                            }
                            break;
                        case 'daily':
                            switch (state.daily.subTab) {
                                case 'everyDays':
                                    $scope.ngModel = `0 ${state.daily.minutes} ${hourToCron(state.daily.hours, state.daily.hourType)} 1/${state.daily.everyDays.days} * ? *`;
                                    break;
                                case 'everyWeekDay':
                                    $scope.ngModel = `0 ${state.daily.minutes} ${hourToCron(state.daily.hours, state.daily.hourType)} ? * MON-FRI *`;
                                    break;
                                default:
                                    throw 'Invalid cron daily subtab selection';
                            }
                            break;
                        case 'weekly':
                            const days = selectOptions.days
                                .reduce((acc, day) => state.weekly[day] ? acc.concat([day]) : acc, [])
                                .join(',');
                            $scope.ngModel = `0 ${state.weekly.minutes} ${hourToCron(state.weekly.hours, state.weekly.hourType)} ? * ${days} *`;
                            break;
                        case 'monthly':
                            switch (state.monthly.subTab) {
                                case 'specificDay':
                                    $scope.ngModel = `0 ${state.monthly.minutes} ${hourToCron(state.monthly.hours, state.monthly.hourType)} ${state.monthly.specificDay.day} 1/${state.monthly.specificDay.months} ? *`;
                                    break;
                                case 'specificWeekDay':
                                    $scope.ngModel = `0 ${state.monthly.minutes} ${hourToCron(state.monthly.hours, state.monthly.hourType)} ? 1/${state.monthly.specificWeekDay.months} ${state.monthly.specificWeekDay.day}#${state.monthly.specificWeekDay.monthWeek} *`;
                                    break;
                                default:
                                    throw 'Invalid cron monthly subtab selection';
                            }
                            break;
                        case 'yearly':
                            switch (state.yearly.subTab) {
                                case 'specificMonthDay':
                                    $scope.ngModel = `0 ${state.yearly.minutes} ${hourToCron(state.yearly.hours, state.yearly.hourType)} ${state.yearly.specificMonthDay.day} ${state.yearly.specificMonthDay.month} ? *`;
                                    break;
                                case 'specificMonthWeek':
                                    $scope.ngModel = `0 ${state.yearly.minutes} ${hourToCron(state.yearly.hours, state.yearly.hourType)} ? ${state.yearly.specificMonthWeek.month} ${state.yearly.specificMonthWeek.day}#${state.yearly.specificMonthWeek.monthWeek} *`;
                                    break;
                                default:
                                    throw 'Invalid cron yearly subtab selection';
                            }
                            break;
                        case 'advanced':
                            $scope.ngModel = state.advanced.expression;
                            break;
                        default:
                            throw 'Invalid cron active tab selection';
                    }
                };
            }
        })]);
})();
