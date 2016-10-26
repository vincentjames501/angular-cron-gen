'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {

    var ACCEPTABLE_CRON_FORMATS = ['quartz'];
    var DEFAULT_TEMPLATE = 'angular-cron-gen/cron-gen.html';
    var DAY_LOOKUPS = {
        'SUN': 'Sunday',
        'MON': 'Monday',
        'TUE': 'Tuesday',
        'WED': 'Wednesday',
        'THU': 'Thursday',
        'FRI': 'Friday',
        'SAT': 'Saturday'
    };
    var MONTH_WEEK_LOOKUPS = {
        '1': 'First',
        '2': 'Second',
        '3': 'Third',
        '4': 'Fourth'
    };
    var MONTH_LOOKUPS = {
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
    var States = {
        INIT: Symbol('INIT'),
        DIRTY: Symbol('DIRTY'),
        CLEAN: Symbol('CLEAN')
    };
    var QUARTZ_REGEX = /^\s*($|#|\w+\s*=|(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?(?:,(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?)*)\s+(\?|\*|(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?(?:,(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?)*)\s+(\?|\*|(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\?|\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\s+(\?|\*|(?:[0-6])(?:(?:-|\/|\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\/|\,|#)(?:[0-6]))?(?:L)?)*|\?|\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\s)+(\?|\*|(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?(?:,(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?)*))$/;

    angular.module('angular-cron-gen', []).factory('cronValidationService', function () {
        return {
            isValid: function isValid(cronFormat, expression) {
                var formattedExpression = expression.toUpperCase();
                switch (cronFormat) {
                    case 'quartz':
                        return !!formattedExpression.match(QUARTZ_REGEX);
                    default:
                        throw 'Desired cron format (' + cronFormat + ') is not available';
                }
            }
        };
    }).directive('cronGen', ['$templateRequest', '$sce', '$compile', '$log', 'cronValidationService', function ($templateRequest, $sce, $compile, $log, cronValidationService) {
        return {
            scope: {
                ngModel: '=',
                ngDisabled: '=',
                options: '=',
                cronFormat: '@',
                templateUrl: '@'
            },
            require: ['ngModel', '?ngDisabled', '^?form'],
            replace: true,
            restrict: 'E',
            link: function link($scope, elem, attrs, _ref) {
                var _ref2 = _slicedToArray(_ref, 3);

                var ngModelCtrl = _ref2[0];
                var formCtrl = _ref2[2];

                //Extract our options
                var _$scope$options = $scope.options;
                _$scope$options = _$scope$options === undefined ? {} : _$scope$options;
                var _$scope$options$formI = _$scope$options.formInputClass;
                var formInputClass = _$scope$options$formI === undefined ? 'form-control-static' : _$scope$options$formI;
                var _$scope$options$formS = _$scope$options.formSelectClass;
                var formSelectClass = _$scope$options$formS === undefined ? 'form-control-static' : _$scope$options$formS;
                var _$scope$options$formR = _$scope$options.formRadioClass;
                var formRadioClass = _$scope$options$formR === undefined ? 'form-control-static' : _$scope$options$formR;
                var _$scope$options$hideM = _$scope$options.hideMinutesTab;
                var hideMinutesTab = _$scope$options$hideM === undefined ? false : _$scope$options$hideM;
                var _$scope$options$hideH = _$scope$options.hideHourlyTab;
                var hideHourlyTab = _$scope$options$hideH === undefined ? false : _$scope$options$hideH;
                var _$scope$options$hideD = _$scope$options.hideDailyTab;
                var hideDailyTab = _$scope$options$hideD === undefined ? false : _$scope$options$hideD;
                var _$scope$options$hideW = _$scope$options.hideWeeklyTab;
                var hideWeeklyTab = _$scope$options$hideW === undefined ? false : _$scope$options$hideW;
                var _$scope$options$hideM2 = _$scope$options.hideMonthlyTab;
                var hideMonthlyTab = _$scope$options$hideM2 === undefined ? false : _$scope$options$hideM2;
                var _$scope$options$hideY = _$scope$options.hideYearlyTab;
                var hideYearlyTab = _$scope$options$hideY === undefined ? false : _$scope$options$hideY;
                var _$scope$options$hideA = _$scope$options.hideAdvancedTab;
                var hideAdvancedTab = _$scope$options$hideA === undefined ? true : _$scope$options$hideA;
                var _$scope$cronFormat = $scope.cronFormat;
                var cronFormat = _$scope$cronFormat === undefined ? 'quartz' : _$scope$cronFormat;
                var _$scope$templateUrl = $scope.templateUrl;
                var templateUrl = _$scope$templateUrl === undefined ? DEFAULT_TEMPLATE : _$scope$templateUrl;

                //Define our directive state

                var state = $scope.state = {
                    formInputClass: formInputClass,
                    formSelectClass: formSelectClass,
                    formRadioClass: formRadioClass,
                    state: States.INIT,
                    activeTab: function () {
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
                    }(),
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
                            hours: 0,
                            minutes: 0
                        }
                    },
                    daily: {
                        isHidden: hideDailyTab,
                        subTab: 'everyDays',
                        everyDays: {
                            days: 1
                        },
                        hours: 0,
                        minutes: 0
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
                        hours: 0,
                        minutes: 0
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
                        hours: 0,
                        minutes: 0
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
                        hours: 0,
                        minutes: 0
                    },
                    advanced: {
                        isHidden: hideAdvancedTab,
                        expression: null
                    }
                };

                //Select options for ng-options
                var selectOptions = $scope.selectOptions = {
                    hours: [].concat(_toConsumableArray(new Array(24).keys())),
                    minutes: [].concat(_toConsumableArray(new Array(60).keys())),
                    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    monthWeeks: [1, 2, 3, 4],
                    days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
                };

                //If possible, add our cron expression validator to our form
                if (formCtrl && attrs.name) {
                    ngModelCtrl.$validators.testCronExpr = function (expression) {
                        return cronValidationService.isValid(cronFormat, expression);
                    };
                }

                //Handle tab navigation
                $scope.setActiveTab = function ($event, state, tab, isDisabled) {
                    $event.preventDefault();
                    if (!isDisabled) {
                        state.activeTab = tab;
                        regenerateCron(state);
                    }
                };

                //Validate our opts
                if (!ACCEPTABLE_CRON_FORMATS.includes(cronFormat)) {
                    throw 'Desired cron format (' + cronFormat + ') is not available';
                }
                if (!templateUrl) {
                    throw 'Invalid template url (' + templateUrl + ')';
                }

                //Trust and fetch the requested template
                var trustedUrl = $sce.getTrustedResourceUrl(templateUrl);
                $templateRequest(trustedUrl).then(function (template) {
                    return elem.replaceWith($compile(template)($scope));
                }, function (error) {
                    return $log.error('Failed to load requested template', error);
                });

                //Utility Functions
                $scope.padNumber = function (number) {
                    return ('' + number).length === 1 ? '0' + number : '' + number;
                };
                $scope.dayDisplay = function (day) {
                    return DAY_LOOKUPS[day];
                };
                $scope.monthWeekDisplay = function (monthWeekNumber) {
                    return MONTH_WEEK_LOOKUPS[monthWeekNumber];
                };
                $scope.monthDisplay = function (monthNumber) {
                    return MONTH_LOOKUPS[monthNumber];
                };

                //On model changes, update our state to reflect the user's input
                $scope.$watch('ngModel', function (cron) {
                    state.advanced.expression = cron;

                    if (state.state === States.DIRTY) {
                        state.state = States.CLEAN;
                        return;
                    } else {
                        state.state = States.CLEAN;
                    }

                    var segments = cron.split(' ');
                    if (segments.length === 6 || segments.length === 7) {
                        var _segments = _slicedToArray(segments, 6);

                        var minutes = _segments[1];
                        var hours = _segments[2];
                        var dayOfMonth = _segments[3];
                        var month = _segments[4];
                        var dayOfWeek = _segments[5];

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
                            selectOptions.days.forEach(function (weekDay) {
                                return state.weekly[weekDay] = false;
                            });
                            dayOfWeek.split(',').forEach(function (weekDay) {
                                return state.weekly[weekDay] = true;
                            });
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
                            var _dayOfWeek$split = dayOfWeek.split('#');

                            var _dayOfWeek$split2 = _slicedToArray(_dayOfWeek$split, 2);

                            var day = _dayOfWeek$split2[0];
                            var monthWeek = _dayOfWeek$split2[1];

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
                            var _dayOfWeek$split3 = dayOfWeek.split('#');

                            var _dayOfWeek$split4 = _slicedToArray(_dayOfWeek$split3, 2);

                            var _day = _dayOfWeek$split4[0];
                            var _monthWeek = _dayOfWeek$split4[1];

                            state.activeTab = 'yearly';
                            state.yearly.subTab = 'specificMonthWeek';
                            state.yearly.specificMonthWeek.monthWeek = parseInt(_monthWeek);
                            state.yearly.specificMonthWeek.day = _day;
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

                // Watch for option changes
                $scope.$watch('options', function () {
                    var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                    var _ref3$formInputClass = _ref3.formInputClass;
                    var formInputClass = _ref3$formInputClass === undefined ? 'form-control-static' : _ref3$formInputClass;
                    var _ref3$formSelectClass = _ref3.formSelectClass;
                    var formSelectClass = _ref3$formSelectClass === undefined ? 'form-control-static' : _ref3$formSelectClass;
                    var _ref3$formRadioClass = _ref3.formRadioClass;
                    var formRadioClass = _ref3$formRadioClass === undefined ? 'form-control-static' : _ref3$formRadioClass;
                    var _ref3$hideMinutesTab = _ref3.hideMinutesTab;
                    var hideMinutesTab = _ref3$hideMinutesTab === undefined ? false : _ref3$hideMinutesTab;
                    var _ref3$hideHourlyTab = _ref3.hideHourlyTab;
                    var hideHourlyTab = _ref3$hideHourlyTab === undefined ? false : _ref3$hideHourlyTab;
                    var _ref3$hideDailyTab = _ref3.hideDailyTab;
                    var hideDailyTab = _ref3$hideDailyTab === undefined ? false : _ref3$hideDailyTab;
                    var _ref3$hideWeeklyTab = _ref3.hideWeeklyTab;
                    var hideWeeklyTab = _ref3$hideWeeklyTab === undefined ? false : _ref3$hideWeeklyTab;
                    var _ref3$hideMonthlyTab = _ref3.hideMonthlyTab;
                    var hideMonthlyTab = _ref3$hideMonthlyTab === undefined ? false : _ref3$hideMonthlyTab;
                    var _ref3$hideYearlyTab = _ref3.hideYearlyTab;
                    var hideYearlyTab = _ref3$hideYearlyTab === undefined ? false : _ref3$hideYearlyTab;
                    var _ref3$hideAdvancedTab = _ref3.hideAdvancedTab;
                    var hideAdvancedTab = _ref3$hideAdvancedTab === undefined ? true : _ref3$hideAdvancedTab;

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
                var regenerateCron = $scope.regenerateCron = function (state) {
                    state.state = States.DIRTY;
                    switch (state.activeTab) {
                        case 'minutes':
                            $scope.ngModel = '0 0/' + state.minutes.minutes + ' * 1/1 * ? *';
                            break;
                        case 'hourly':
                            switch (state.hourly.subTab) {
                                case 'every':
                                    $scope.ngModel = '0 0 0/' + state.hourly.every.hours + ' 1/1 * ? *';
                                    break;
                                case 'specific':
                                    $scope.ngModel = '0 ' + state.hourly.specific.minutes + ' ' + state.hourly.specific.hours + ' 1/1 * ? *';
                                    break;
                                default:
                                    throw 'Invalid cron hourly subtab selection';
                            }
                            break;
                        case 'daily':
                            switch (state.daily.subTab) {
                                case 'everyDays':
                                    $scope.ngModel = '0 ' + state.daily.minutes + ' ' + state.daily.hours + ' 1/' + state.daily.everyDays.days + ' * ? *';
                                    break;
                                case 'everyWeekDay':
                                    $scope.ngModel = '0 ' + state.daily.minutes + ' ' + state.daily.hours + ' ? * MON-FRI *';
                                    break;
                                default:
                                    throw 'Invalid cron daily subtab selection';
                            }
                            break;
                        case 'weekly':
                            var days = selectOptions.days.reduce(function (acc, day) {
                                return state.weekly[day] ? acc.concat([day]) : acc;
                            }, []).join(',');
                            $scope.ngModel = '0 ' + state.weekly.minutes + ' ' + state.weekly.hours + ' ? * ' + days + ' *';
                            break;
                        case 'monthly':
                            switch (state.monthly.subTab) {
                                case 'specificDay':
                                    $scope.ngModel = '0 ' + state.monthly.minutes + ' ' + state.monthly.hours + ' ' + state.monthly.specificDay.day + ' 1/' + state.monthly.specificDay.months + ' ? *';
                                    break;
                                case 'specificWeekDay':
                                    $scope.ngModel = '0 ' + state.monthly.minutes + ' ' + state.monthly.hours + ' ? 1/' + state.monthly.specificWeekDay.months + ' ' + state.monthly.specificWeekDay.day + '#' + state.monthly.specificWeekDay.monthWeek + ' *';
                                    break;
                                default:
                                    throw 'Invalid cron monthly subtab selection';
                            }
                            break;
                        case 'yearly':
                            switch (state.yearly.subTab) {
                                case 'specificMonthDay':
                                    $scope.ngModel = '0 ' + state.yearly.minutes + ' ' + state.yearly.hours + ' ' + state.yearly.specificMonthDay.day + ' ' + state.yearly.specificMonthDay.month + ' ? *';
                                    break;
                                case 'specificMonthWeek':
                                    $scope.ngModel = '0 ' + state.yearly.minutes + ' ' + state.yearly.hours + ' ? ' + state.yearly.specificMonthWeek.month + ' ' + state.yearly.specificMonthWeek.day + '#' + state.yearly.specificMonthWeek.monthWeek + ' *';
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
        };
    }]);
})();

angular.module('angular-cron-gen').run(['$templateCache', function ($templateCache) {
    $templateCache.put('angular-cron-gen/cron-gen.html', '<!doctype html>\n<div class="cron-gen-main" ng-cloak>\n    <ul class="nav nav-tabs tab-nav" role="tablist">\n        <li ng-class="{\'active\': state.activeTab === \'minutes\'}"\n            ng-show="!state.minutes.isHidden"\n            role="presentation">\n            <a href="#"\n               aria-controls="minutes"\n               role="tab"\n               data-toggle="tab"\n               ng-click="setActiveTab($event, state, \'minutes\', ngDisabled)">\n                Minutes\n            </a>\n        </li>\n        <li role="presentation"\n            ng-show="!state.hourly.isHidden"\n            ng-class="{\'active\': state.activeTab === \'hourly\'}">\n            <a href="#"\n               aria-controls="hourly"\n               role="tab"\n               data-toggle="tab"\n               ng-click="setActiveTab($event, state, \'hourly\', ngDisabled)">\n                Hourly\n            </a>\n        </li>\n        <li role="presentation"\n            ng-show="!state.daily.isHidden"\n            ng-class="{\'active\': state.activeTab === \'daily\'}">\n            <a href="#"\n               aria-controls="daily"\n               role="tab"\n               data-toggle="tab"\n               ng-click="setActiveTab($event, state, \'daily\', ngDisabled)">\n                Daily\n            </a>\n        </li>\n        <li role="presentation"\n            ng-show="!state.weekly.isHidden"\n            ng-class="{\'active\': state.activeTab === \'weekly\'}">\n            <a href="#" aria-controls="weekly"\n               role="tab"\n               data-toggle="tab"\n               ng-click="setActiveTab($event, state, \'weekly\', ngDisabled)">\n                Weekly\n            </a>\n        </li>\n        <li role="presentation"\n            ng-show="!state.monthly.isHidden"\n            ng-class="{\'active\': state.activeTab === \'monthly\'}">\n            <a href="#"\n               aria-controls="monthly"\n               role="tab"\n               data-toggle="tab"\n               ng-click="setActiveTab($event, state, \'monthly\', ngDisabled)">\n                Monthly\n            </a>\n        </li>\n        <li role="presentation"\n            ng-show="!state.yearly.isHidden"\n            ng-class="{\'active\': state.activeTab === \'yearly\'}">\n            <a href="#"\n               aria-controls="yearly"\n               role="tab"\n               data-toggle="tab"\n               ng-click="setActiveTab($event, state, \'yearly\', ngDisabled)">\n                Yearly\n            </a>\n        </li>\n        <li role="presentation"\n            ng-show="!state.advanced.isHidden"\n            ng-class="{\'active\': state.activeTab === \'advanced\'}">\n            <a href="#"\n               aria-controls="advanced"\n               role="tab"\n               data-toggle="tab"\n               ng-click="setActiveTab($event, state, \'advanced\', ngDisabled)">\n                Advanced\n            </a>\n        </li>\n    </ul>\n    <div class="cron-gen-container">\n        <div class="row">\n            <div class="col-xs-12">\n                <div class="tab-content">\n                    <div class="tab-pane"\n                         ng-show="!state.minutes.isHidden"\n                         ng-class="{\'active\': state.activeTab === \'minutes\'}">\n                        Every\n                        <input class="minutes"\n                               type="number"\n                               min="1"\n                               max="59"\n                               ng-disabled="ngDisabled"\n                               ng-change="regenerateCron(state)"\n                               ng-model="state.minutes.minutes"\n                               ng-required="state.activeTab === \'minutes\'"\n                               ng-class="state.formInputClass">\n                        minute(s)\n                    </div>\n                    <div class="tab-pane"\n                         ng-show="!state.hourly.isHidden"\n                         ng-class="{\'active\': state.activeTab === \'hourly\'}">\n                        <div class="well well-small">\n                            <input type="radio"\n                                   value="every"\n                                   name="hourly-radio"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.hourly.subTab"\n                                   ng-class="state.formRadioClass"\n                                   checked="checked">\n                            Every\n                            <input class="hours"\n                                   type="number"\n                                   min="1"\n                                   max="23"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.hourly.every.hours"\n                                   ng-required="state.activeTab === \'hourly\' && state.hourly.subTab === \'every\'"\n                                   ng-class="state.formInputClass">\n                            hour(s)\n                        </div>\n                        <div class="well well-small">\n                            <input type="radio"\n                                   value="specific"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.hourly.subTab"\n                                   ng-class="state.formRadioClass"\n                                   name="hourly-radio">\n                            At\n                            <select class="hours"\n                                    ng-disabled="ngDisabled"\n                                    ng-change="regenerateCron(state)"\n                                    ng-model="state.hourly.specific.hours"\n                                    ng-options="hour as padNumber(hour) for hour in selectOptions.hours"\n                                    ng-required="state.activeTab === \'hourly\' && state.hourly.subTab === \'specific\'"\n                                    ng-class="state.formSelectClass">\n                            </select>\n                            <select class="minutes"\n                                    ng-disabled="ngDisabled"\n                                    ng-change="regenerateCron(state)"\n                                    ng-model="state.hourly.specific.minutes"\n                                    ng-options="minute as padNumber(minute) for minute in selectOptions.minutes"\n                                    ng-required="state.activeTab === \'hourly\' && state.hourly.subTab === \'specific\'"\n                                    ng-class="state.formSelectClass">\n                            </select>\n                        </div>\n                    </div>\n                    <div class="tab-pane"\n                         ng-show="!state.daily.isHidden"\n                         ng-class="{\'active\': state.activeTab === \'daily\'}">\n                        <div class="well well-small">\n                            <input type="radio"\n                                   value="everyDays"\n                                   name="daily-radio"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.daily.subTab"\n                                   ng-class="state.formRadioClass"\n                                   checked="checked">\n                            Every\n                            <input class="days"\n                                   type="number"\n                                   min="1"\n                                   max="31"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.daily.everyDays.days"\n                                   ng-required="state.activeTab === \'daily\' && state.daily.subTab === \'everyDays\'"\n                                   ng-class="state.formInputClass">\n                            day(s)\n                        </div>\n                        <div class="well well-small">\n                            <input type="radio"\n                                   value="everyWeekDay"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.daily.subTab"\n                                   ng-class="state.formRadioClass"\n                                   name="daily-radio">\n                            Every week day (Monday through Friday)\n                        </div>\n\n                        Start time\n                        <select class="hours"\n                                ng-disabled="ngDisabled"\n                                ng-change="regenerateCron(state)"\n                                ng-required="state.activeTab === \'daily\'"\n                                ng-model="state.daily.hours"\n                                ng-options="hour as padNumber(hour) for hour in selectOptions.hours"\n                                ng-class="state.formSelectClass">\n                        </select>\n                        <select class="minutes"\n                                ng-disabled="ngDisabled"\n                                ng-change="regenerateCron(state)"\n                                ng-required="state.activeTab === \'daily\'"\n                                ng-model="state.daily.minutes"\n                                ng-options="minute as padNumber(minute) for minute in selectOptions.minutes"\n                                ng-class="state.formSelectClass">\n                        </select>\n                    </div>\n                    <div class="tab-pane"\n                         ng-show="!state.weekly.isHidden"\n                         ng-class="{\'active\': state.activeTab === \'weekly\'}">\n                        <div class="well well-small">\n                            <div class="span6 col-sm-6">\n                                <input type="checkbox"\n                                       ng-disabled="ngDisabled"\n                                       ng-change="regenerateCron(state)"\n                                       ng-model="state.weekly.MON"\n                                       ng-class="state.formInputClass">\n                                Monday<br>\n                                <input type="checkbox"\n                                       ng-disabled="ngDisabled"\n                                       ng-change="regenerateCron(state)"\n                                       ng-model="state.weekly.WED"\n                                       ng-class="state.formInputClass">\n                                Wednesday<br>\n                                <input type="checkbox"\n                                       ng-disabled="ngDisabled"\n                                       ng-change="regenerateCron(state)"\n                                       ng-model="state.weekly.FRI"\n                                       ng-class="state.formInputClass">\n                                Friday<br>\n                                <input type="checkbox"\n                                       ng-disabled="ngDisabled"\n                                       ng-change="regenerateCron(state)"\n                                       ng-model="state.weekly.SUN"\n                                       ng-class="state.formInputClass">\n                                Sunday\n                            </div>\n                            <div class="span6 col-sm-6">\n                                <input type="checkbox"\n                                       ng-disabled="ngDisabled"\n                                       ng-change="regenerateCron(state)"\n                                       ng-model="state.weekly.TUE"\n                                       ng-class="state.formInputClass">\n                                Tuesday<br>\n                                <input type="checkbox"\n                                       ng-disabled="ngDisabled"\n                                       ng-change="regenerateCron(state)"\n                                       ng-model="state.weekly.THU"\n                                       ng-class="state.formInputClass">\n                                Thursday<br>\n                                <input type="checkbox"\n                                       ng-disabled="ngDisabled"\n                                       ng-change="regenerateCron(state)"\n                                       ng-model="state.weekly.SAT"\n                                       ng-class="state.formInputClass">\n                                Saturday\n                            </div>\n                            <br><br><br><br>\n                        </div>\n                        Start time\n                        <select class="hours"\n                                ng-disabled="ngDisabled"\n                                ng-change="regenerateCron(state)"\n                                ng-required="state.activeTab === \'weekly\'"\n                                ng-model="state.weekly.hours"\n                                ng-options="hour as padNumber(hour) for hour in selectOptions.hours"\n                                ng-class="state.formSelectClass">\n                        </select>\n                        <select class="minutes"\n                                ng-disabled="ngDisabled"\n                                ng-change="regenerateCron(state)"\n                                ng-required="state.activeTab === \'weekly\'"\n                                ng-model="state.weekly.minutes"\n                                ng-options="minute as padNumber(minute) for minute in selectOptions.minutes"\n                                ng-class="state.formSelectClass">\n                        </select>\n                    </div>\n                    <div class="tab-pane"\n                         ng-show="!state.monthly.isHidden"\n                         ng-class="{\'active\': state.activeTab === \'monthly\'}">\n                        <div class="well well-small">\n                            <input type="radio"\n                                   value="specificDay"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.monthly.subTab"\n                                   ng-class="state.formRadioClass"\n                                   name="monthly-radio"\n                                   checked="checked">\n                            Day\n                            <input class="days"\n                                   type="number"\n                                   min="1"\n                                   max="31"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.monthly.specificDay.day"\n                                   ng-required="state.activeTab === \'monthly\' && state.monthly.subTab === \'specificDay\'"\n                                   ng-class="state.formInputClass">\n                            of every\n                            <input class="months-small"\n                                   type="number"\n                                   min="1"\n                                   max="11"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.monthly.specificDay.months"\n                                   ng-required="state.activeTab === \'monthly\' && state.monthly.subTab === \'specificDay\'"\n                                   ng-class="state.formInputClass">\n                            month(s)\n                        </div>\n                        <div class="well well-small">\n                            <input type="radio"\n                                   value="specificWeekDay"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.monthly.subTab"\n                                   ng-class="state.formRadioClass"\n                                   name="monthly-radio">\n                            <select class="day-order-in-month"\n                                    ng-disabled="ngDisabled"\n                                    ng-change="regenerateCron(state)"\n                                    ng-model="state.monthly.specificWeekDay.monthWeek"\n                                    ng-required="state.activeTab === \'monthly\' && state.monthly.subTab === \'specificWeekDay\'"\n                                    ng-options="monthWeek as monthWeekDisplay(monthWeek) for monthWeek in selectOptions.monthWeeks"\n                                    ng-class="state.formSelectClass">\n                            </select>\n                            <select class="week-days"\n                                    ng-disabled="ngDisabled"\n                                    ng-change="regenerateCron(state)"\n                                    ng-model="state.monthly.specificWeekDay.day"\n                                    ng-required="state.activeTab === \'monthly\' && state.monthly.subTab === \'specificWeekDay\'"\n                                    ng-options="day as dayDisplay(day) for day in selectOptions.days"\n                                    ng-class="state.formSelectClass">\n                            </select>\n                            of every\n                            <input class="months-small"\n                                   type="number"\n                                   min="1"\n                                   max="11"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.monthly.specificWeekDay.months"\n                                   ng-required="state.activeTab === \'monthly\' && state.monthly.subTab === \'specificWeekDay\'"\n                                   ng-class="state.formInputClass">\n                            month(s)\n                        </div>\n                        Start time\n                        <select class="hours"\n                                ng-disabled="ngDisabled"\n                                ng-change="regenerateCron(state)"\n                                ng-required="state.activeTab === \'monthly\'"\n                                ng-model="state.monthly.hours"\n                                ng-options="hour as padNumber(hour) for hour in selectOptions.hours"\n                                ng-class="state.formSelectClass">\n                        </select>\n                        <select class="minutes"\n                                ng-disabled="ngDisabled"\n                                ng-change="regenerateCron(state)"\n                                ng-required="state.activeTab === \'monthly\'"\n                                ng-model="state.monthly.minutes"\n                                ng-options="minute as padNumber(minute) for minute in selectOptions.minutes"\n                                ng-class="state.formSelectClass">\n                        </select>\n                    </div>\n                    <div class="tab-pane"\n                         ng-show="!state.yearly.isHidden"\n                         ng-class="{\'active\': state.activeTab === \'yearly\'}">\n                        <div class="well well-small">\n                            <input type="radio"\n                                   value="specificMonthDay"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.yearly.subTab"\n                                   ng-class="state.formRadioClass"\n                                   name="yearly-radio">\n                            Every\n                            <select class="months"\n                                    ng-disabled="ngDisabled"\n                                    ng-change="regenerateCron(state)"\n                                    ng-model="state.yearly.specificMonthDay.month"\n                                    ng-required="state.activeTab === \'yearly\' && state.yearly.subTab === \'specificMonthDay\'"\n                                    ng-options="month as monthDisplay(month) for month in selectOptions.months"\n                                    ng-class="state.formSelectClass">\n                            </select>\n                            in day\n                            <input class="days"\n                                   type="number"\n                                   min="1"\n                                   max="31"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.yearly.specificMonthDay.day"\n                                   ng-required="state.activeTab === \'yearly\' && state.yearly.subTab === \'specificMonthDay\'"\n                                   ng-class="state.formInputClass">\n                        </div>\n                        <div class="well well-small">\n                            <input type="radio"\n                                   value="specificMonthWeek"\n                                   ng-disabled="ngDisabled"\n                                   ng-change="regenerateCron(state)"\n                                   ng-model="state.yearly.subTab"\n                                   ng-class="state.formRadioClass"\n                                   name="yearly-radio">\n                            The\n                            <select class="day-order-in-month"\n                                    ng-disabled="ngDisabled"\n                                    ng-change="regenerateCron(state)"\n                                    ng-model="state.yearly.specificMonthWeek.monthWeek"\n                                    ng-required="state.activeTab === \'yearly\' && state.yearly.subTab === \'specificMonthWeek\'"\n                                    ng-options="monthWeek as monthWeekDisplay(monthWeek) for monthWeek in selectOptions.monthWeeks"\n                                    ng-class="state.formSelectClass">\n                            </select>\n                            <select class="week-days"\n                                    ng-disabled="ngDisabled"\n                                    ng-change="regenerateCron(state)"\n                                    ng-model="state.yearly.specificMonthWeek.day"\n                                    ng-required="state.activeTab === \'yearly\' && state.yearly.subTab === \'specificMonthWeek\'"\n                                    ng-options="day as dayDisplay(day) for day in selectOptions.days"\n                                    ng-class="state.formSelectClass">\n                            </select>\n                            of\n                            <select class="months"\n                                    ng-disabled="ngDisabled"\n                                    ng-change="regenerateCron(state)"\n                                    ng-model="state.yearly.specificMonthWeek.month"\n                                    ng-required="state.activeTab === \'yearly\' && state.yearly.subTab === \'specificMonthWeek\'"\n                                    ng-options="month as monthDisplay(month) for month in selectOptions.months"\n                                    ng-class="state.formSelectClass">\n                            </select>\n                        </div>\n                        Start time\n                        <select class="hours"\n                                ng-disabled="ngDisabled"\n                                ng-change="regenerateCron(state)"\n                                ng-required="state.activeTab === \'yearly\'"\n                                ng-model="state.yearly.hours"\n                                ng-options="hour as padNumber(hour) for hour in selectOptions.hours"\n                                ng-class="state.formSelectClass">\n                        </select>\n                        <select class="minutes"\n                                ng-disabled="ngDisabled"\n                                ng-change="regenerateCron(state)"\n                                ng-required="state.activeTab === \'yearly\'"\n                                ng-model="state.yearly.minutes"\n                                ng-options="minute as padNumber(minute) for minute in selectOptions.minutes"\n                                ng-class="state.formSelectClass">\n                        </select>\n                    </div>\n                    <div class="tab-pane"\n                         ng-show="!state.advanced.isHidden"\n                         ng-class="{\'active\': state.activeTab === \'advanced\'}">\n                        Cron Expression\n                        <input type="text"\n                               ng-disabled="ngDisabled"\n                               ng-change="regenerateCron(state)"\n                               ng-model="state.advanced.expression"\n                               ng-required="state.activeTab === \'advanced\'"\n                               ng-class="state.formInputClass">\n\n                        <p>More details about how to create these expressions can be found <a\n                                href="http://www.quartz-scheduler.org/documentation/quartz-2.x/tutorials/crontrigger.html"\n                                target="_blank">here</a>.</p>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n');
}]);