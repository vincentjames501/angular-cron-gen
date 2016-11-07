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
        '#1': 'First',
        '#2': 'Second',
        '#3': 'Third',
        '#4': 'Fourth',
        '#5': 'Fifth',
        'L': 'Last'
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
    const QUARTZ_REGEX = /^\s*($|#|\w+\s*=|(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?(?:,(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?)*)\s+(\?|\*|(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?(?:,(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?)*)\s+(\?|\*|(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\?|\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\s+(\?|\*|(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-|\/|\,|#)(?:[1-5]))?(?:L)?(?:,(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-|\/|\,|#)(?:[1-5]))?(?:L)?)*|\?|\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\s)+(\?|\*|(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?(?:,(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?)*))$/;

    angular.module('angular-cron-gen', [])
        .factory('cronGenService', () => ({
            isValid(cronFormat, expression) {
                const formattedExpression = expression.toUpperCase();
                switch (cronFormat) {
                    case 'quartz':
                        return !!formattedExpression.match(QUARTZ_REGEX);
                    default:
                        throw `Desired cron format (${cronFormat}) is not available`;
                }
            },
            appendInt(number) {
                const value = `${number}`;
                if (value.length > 1) {
                    const secondToLastDigit = value.charAt(value.length - 2);
                    if (secondToLastDigit === '1') {
                        return "th";
                    }
                }
                const lastDigit = value.charAt(value.length - 1);
                switch (lastDigit) {
                    case '1':
                        return "st";
                    case '2':
                        return "nd";
                    case '3':
                        return "rd";
                    default:
                        return "th";
                }
            }
        }))
        .directive('cronGenTimeSelect', [() => ({
            scope: {
                isDisabled: '=',
                onChange: '&',
                isRequired: '=',
                model: '=',
                selectClass: '=',
                use24HourTime: '=',
                namePrefix: '@'
            },
            template: `
                <div class="inline-block">
                    <select class="hours"
                            name="{{namePrefix}}Hours"
                            ng-disabled="isDisabled"
                            ng-change="onChange()"
                            ng-required="isRequired"
                            ng-model="model.hours"
                            ng-options="hour as padNumber(hour) for hour in selectOptions.hours"
                            ng-class="selectClass">
                    </select>
                    <select class="minutes"
                            name="{{namePrefix}}Minutes"
                            ng-disabled="isDisabled"
                            ng-change="onChange()"
                            ng-required="isRequired"
                            ng-model="model.minutes"
                            ng-options="minute as padNumber(minute) for minute in selectOptions.minutes"
                            ng-class="selectClass">
                    </select>
                    <select class="hour-types"
                            name="{{namePrefix}}HourType"
                            ng-show="!use24HourTime"
                            ng-disabled="isDisabled"
                            ng-change="onChange()"
                            ng-model="model.hourType"
                            ng-options="hourType as hourType for hourType in selectOptions.hourTypes"
                            ng-required="isRequired"
                            ng-class="selectClass">
                    </select>
                </div>`,
            replace: true,
            restrict: 'E',
            link($scope) {
                //Utility functions
                $scope.padNumber = (number) => `${number}`.length === 1 ? `0${number}` : `${number}`;

                //Select options
                $scope.selectOptions = {
                    hours: $scope.use24HourTime ? [...new Array(24).keys()] : [...new Array(12).keys()].map(x => x + 1),
                    minutes: [...new Array(60).keys()],
                    hourTypes: ['AM', 'PM']
                };
            }
        })])
        .directive('cronGen', ['$templateRequest', '$sce', '$compile', '$log', 'cronGenService', ($templateRequest, $sce, $compile, $log, cronGenService) => ({
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
                        formInputClass = 'form-control cron-gen-input',
                        formSelectClass = 'form-control cron-gen-select',
                        formRadioClass = 'form-control-static cron-gen-radio',
                        formCheckboxClass = 'form-control-static cron-gen-checkbox',
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
                    formCheckboxClass,
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
                            days: 1,
                            hours: showAs24HourTime ? 0 : 1,
                            minutes: 0,
                            hourType: showAs24HourTime ? null : 'AM'
                        },
                        everyWeekDay: {
                            hours: showAs24HourTime ? 0 : 1,
                            minutes: 0,
                            hourType: showAs24HourTime ? null : 'AM'
                        }
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
                            day: '1',
                            months: 1,
                            hours: showAs24HourTime ? 0 : 1,
                            minutes: 0,
                            hourType: showAs24HourTime ? null : 'AM'
                        },
                        specificWeekDay: {
                            monthWeek: '#1',
                            day: 'MON',
                            months: 1,
                            hours: showAs24HourTime ? 0 : 1,
                            minutes: 0,
                            hourType: showAs24HourTime ? null : 'AM'
                        }
                    },
                    yearly: {
                        isHidden: hideYearlyTab,
                        subTab: 'specificMonthDay',
                        specificMonthDay: {
                            month: 1,
                            day: '1',
                            hours: showAs24HourTime ? 0 : 1,
                            minutes: 0,
                            hourType: showAs24HourTime ? null : 'AM'
                        },
                        specificMonthWeek: {
                            monthWeek: '#1',
                            day: 'MON',
                            month: 1,
                            hours: showAs24HourTime ? 0 : 1,
                            minutes: 0,
                            hourType: showAs24HourTime ? null : 'AM'
                        }
                    },
                    advanced: {
                        isHidden: hideAdvancedTab,
                        expression: null
                    }
                };

                //Select options for ng-options
                const selectOptions = $scope.selectOptions = {
                    months: [...new Array(11).keys()].map(x => x + 1),
                    monthWeeks: ['#1', '#2', '#3', '#4', '#5', 'L'],
                    days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                    minutes: [...new Array(59).keys()].map(x => x + 1),
                    hours: [...new Array(23).keys()].map(x => x + 1),
                    monthDays: [...new Array(31).keys()].map(x => x + 1),
                    monthDaysWithLasts: ['1W', ...[...new Array(31).keys()].map(x => `${x + 1}`), 'LW', 'L']
                };

                //If possible, add our cron expression validator to our form
                if (formCtrl && attrs.name) {
                    ngModelCtrl.$validators.testCronExpr = expression => cronGenService.isValid(cronFormat, expression);
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
                $scope.dayDisplay = (day) => DAY_LOOKUPS[day];
                $scope.monthWeekDisplay = (monthWeekNumber) => MONTH_WEEK_LOOKUPS[monthWeekNumber];
                $scope.monthDisplay = (monthNumber) => MONTH_LOOKUPS[monthNumber];
                $scope.monthDayDisplay = (monthDay) => {
                    if (monthDay === 'L') {
                        return 'Last Day';
                    } else if (monthDay === 'LW') {
                        return 'Last Weekday';
                    } else if (monthDay === '1W') {
                        return 'First Weekday';
                    } else {
                        return `${monthDay}${cronGenService.appendInt(monthDay)} Day`;
                    }
                };

                function processHour(hours) {
                    if (state.use24HourTime) {
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
                            state.daily.everyDays.hours = processHour(parsedHours);
                            state.daily.everyDays.hourType = getHourType(parsedHours);
                            state.daily.everyDays.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \? \* MON\-FRI \*/)) {
                            state.activeTab = 'daily';
                            state.daily.subTab = 'everyWeekDay';
                            const parsedHours = parseInt(hours);
                            state.daily.everyWeekDay.hours = processHour(parsedHours);
                            state.daily.everyWeekDay.hourType = getHourType(parsedHours);
                            state.daily.everyWeekDay.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \? \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
                            state.activeTab = 'weekly';
                            selectOptions.days.forEach(weekDay => state.weekly[weekDay] = false);
                            dayOfWeek.split(',').forEach(weekDay => state.weekly[weekDay] = true);
                            const parsedHours = parseInt(hours);
                            state.weekly.hours = processHour(parsedHours);
                            state.weekly.hourType = getHourType(parsedHours);
                            state.weekly.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ (\d+|L|LW|1W) 1\/\d+ \? \*/)) {
                            state.activeTab = 'monthly';
                            state.monthly.subTab = 'specificDay';
                            state.monthly.specificDay.day = dayOfMonth;
                            state.monthly.specificDay.months = parseInt(month.substring(2));
                            const parsedHours = parseInt(hours);
                            state.monthly.specificDay.hours = processHour(parsedHours);
                            state.monthly.specificDay.hourType = getHourType(parsedHours);
                            state.monthly.specificDay.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \? 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
                            const day = dayOfWeek.substr(0, 3);
                            const monthWeek = dayOfWeek.substr(3);
                            state.activeTab = 'monthly';
                            state.monthly.subTab = 'specificWeekDay';
                            state.monthly.specificWeekDay.monthWeek = monthWeek;
                            state.monthly.specificWeekDay.day = day;
                            state.monthly.specificWeekDay.months = parseInt(month.substring(2));
                            const parsedHours = parseInt(hours);
                            state.monthly.specificWeekDay.hours = processHour(parsedHours);
                            state.monthly.specificWeekDay.hourType = getHourType(parsedHours);
                            state.monthly.specificWeekDay.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ (\d+|L|LW|1W) \d+ \? \*/)) {
                            state.activeTab = 'yearly';
                            state.yearly.subTab = 'specificMonthDay';
                            state.yearly.specificMonthDay.month = parseInt(month);
                            state.yearly.specificMonthDay.day = dayOfMonth;
                            const parsedHours = parseInt(hours);
                            state.yearly.specificMonthDay.hours = processHour(parsedHours);
                            state.yearly.specificMonthDay.hourType = getHourType(parsedHours);
                            state.yearly.specificMonthDay.minutes = parseInt(minutes);
                        } else if (cron.match(/0 \d+ \d+ \? \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
                            const day = dayOfWeek.substr(0, 3);
                            const monthWeek = dayOfWeek.substr(3);
                            state.activeTab = 'yearly';
                            state.yearly.subTab = 'specificMonthWeek';
                            state.yearly.specificMonthWeek.monthWeek = monthWeek;
                            state.yearly.specificMonthWeek.day = day;
                            state.yearly.specificMonthWeek.month = parseInt(month);
                            const parsedHours = parseInt(hours);
                            state.yearly.specificMonthWeek.hours = processHour(parsedHours);
                            state.yearly.specificMonthWeek.hourType = getHourType(parsedHours);
                            state.yearly.specificMonthWeek.minutes = parseInt(minutes);
                        } else {
                            state.activeTab = 'advanced';
                            state.advanced.expression = cron;
                        }
                    } else {
                        throw 'Unsupported cron expression. Expression must be 6 or 7 segments';
                    }
                });

                function hourToCron(hour, hourType) {
                    if (state.use24HourTime) {
                        return hour;
                    } else {
                        return hourType === 'AM' ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
                    }
                }

                // Watch for option changes
                $scope.$watch('options', ({
                    formInputClass = 'form-control cron-gen-input',
                    formSelectClass = 'form-control cron-gen-select',
                    formRadioClass = 'form-control-static cron-gen-radio',
                    formCheckboxClass = 'form-control-static cron-gen-checkbox',
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
                    state.formCheckboxClass = formCheckboxClass;
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
                                    $scope.ngModel = `0 ${state.daily.everyDays.minutes} ${hourToCron(state.daily.everyDays.hours, state.daily.everyDays.hourType)} 1/${state.daily.everyDays.days} * ? *`;
                                    break;
                                case 'everyWeekDay':
                                    $scope.ngModel = `0 ${state.daily.everyWeekDay.minutes} ${hourToCron(state.daily.everyWeekDay.hours, state.daily.everyWeekDay.hourType)} ? * MON-FRI *`;
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
                                    $scope.ngModel = `0 ${state.monthly.specificDay.minutes} ${hourToCron(state.monthly.specificDay.hours, state.monthly.specificDay.hourType)} ${state.monthly.specificDay.day} 1/${state.monthly.specificDay.months} ? *`;
                                    break;
                                case 'specificWeekDay':
                                    $scope.ngModel = `0 ${state.monthly.specificWeekDay.minutes} ${hourToCron(state.monthly.specificWeekDay.hours, state.monthly.specificWeekDay.hourType)} ? 1/${state.monthly.specificWeekDay.months} ${state.monthly.specificWeekDay.day}${state.monthly.specificWeekDay.monthWeek} *`;
                                    break;
                                default:
                                    throw 'Invalid cron monthly subtab selection';
                            }
                            break;
                        case 'yearly':
                            switch (state.yearly.subTab) {
                                case 'specificMonthDay':
                                    $scope.ngModel = `0 ${state.yearly.specificMonthDay.minutes} ${hourToCron(state.yearly.specificMonthDay.hours, state.yearly.specificMonthDay.hourType)} ${state.yearly.specificMonthDay.day} ${state.yearly.specificMonthDay.month} ? *`;
                                    break;
                                case 'specificMonthWeek':
                                    $scope.ngModel = `0 ${state.yearly.specificMonthWeek.minutes} ${hourToCron(state.yearly.specificMonthWeek.hours, state.yearly.specificMonthWeek.hourType)} ? ${state.yearly.specificMonthWeek.month} ${state.yearly.specificMonthWeek.day}${state.yearly.specificMonthWeek.monthWeek} *`;
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
