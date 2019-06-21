(function () {
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();



























var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var CronGenComponent = function () {
    CronGenComponent.$inject = ["$scope", "$translate", "$filter", "cronGenService"];
    function CronGenComponent($scope, $translate, $filter, cronGenService) {
        'ngInject';

        var _this = this;

        classCallCheck(this, CronGenComponent);
        var ACCEPTABLE_CRON_FORMATS = ['quartz'];
        var States = {
            INIT: 1,
            DIRTY: 2,
            CLEAN: 3
        };
        this.parsedOptions = this.mergeDefaultOptions(this.options);

        $translate.use(this.parsedOptions.language);

        angular.extend(this, {
            cronGenService: cronGenService,
            filter: $filter,
            cronFormat: 'quartz',
            currentState: States.INIT,
            activeTab: function () {
                if (!_this.parsedOptions.hideMinutesTab) {
                    return 'minutes';
                } else if (!_this.parsedOptions.hideHourlyTab) {
                    return 'hourly';
                } else if (!_this.parsedOptions.hideDailyTab) {
                    return 'daily';
                } else if (!_this.parsedOptions.hideWeeklyTab) {
                    return 'weekly';
                } else if (!_this.parsedOptions.hideMonthlyTab) {
                    return 'monthly';
                } else if (!_this.parsedOptions.hideYearlyTab) {
                    return 'yearly';
                } else if (!_this.parsedOptions.hideAdvancedTab) {
                    return 'advanced';
                }
                throw 'No tabs available to make active';
            }(),
            selectOptions: cronGenService.selectOptions(),
            state: {
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
                    subTab: 'everyDays',
                    everyDays: {
                        days: 1,
                        hours: this.parsedOptions.use24HourTime ? 0 : 1,
                        minutes: 0,
                        seconds: 0,
                        hourType: this.parsedOptions.use24HourTime ? null : 'AM'
                    },
                    everyWeekDay: {
                        hours: this.parsedOptions.use24HourTime ? 0 : 1,
                        minutes: 0,
                        seconds: 0,
                        hourType: this.parsedOptions.use24HourTime ? null : 'AM'
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
                    hours: this.parsedOptions.use24HourTime ? 0 : 1,
                    minutes: 0,
                    seconds: 0,
                    hourType: this.parsedOptions.use24HourTime ? null : 'AM'
                },
                monthly: {
                    subTab: 'specificDay',
                    specificDay: {
                        day: '1',
                        months: 1,
                        hours: this.parsedOptions.use24HourTime ? 0 : 1,
                        minutes: 0,
                        seconds: 0,
                        hourType: this.parsedOptions.use24HourTime ? null : 'AM'
                    },
                    specificWeekDay: {
                        monthWeek: '#1',
                        day: 'MON',
                        months: 1,
                        hours: this.parsedOptions.use24HourTime ? 0 : 1,
                        minutes: 0,
                        seconds: 0,
                        hourType: this.parsedOptions.use24HourTime ? null : 'AM'
                    }
                },
                yearly: {
                    subTab: 'specificMonthDay',
                    specificMonthDay: {
                        month: 1,
                        day: '1',
                        hours: this.parsedOptions.use24HourTime ? 0 : 1,
                        minutes: 0,
                        seconds: 0,
                        hourType: this.parsedOptions.use24HourTime ? null : 'AM'
                    },
                    specificMonthWeek: {
                        monthWeek: '#1',
                        day: 'MON',
                        month: 1,
                        hours: this.parsedOptions.use24HourTime ? 0 : 1,
                        minutes: 0,
                        seconds: 0,
                        hourType: this.parsedOptions.use24HourTime ? null : 'AM'
                    }
                },
                advanced: {
                    expression: '0 15 10 L-2 * ?'
                }
            }
        });

        //Validate our opts
        if (ACCEPTABLE_CRON_FORMATS.indexOf(this.cronFormat) == -1) {
            throw 'Desired cron format (' + this.cronFormat + ') is not available';
        }

        //On model changes, update our state to reflect the user's input
        $scope.$watch('$ctrl.ngModel', function (cron) {
            return _this.handleModelChange(cron);
        });

        // Watch for option changes
        $scope.$watch('$ctrl.options', function (options) {
            return _this.parsedOptions = _this.mergeDefaultOptions(options);
        }, true);
    }

    createClass(CronGenComponent, [{
        key: '$onInit',
        value: function $onInit() {
            var _this2 = this;

            //If possible, add our cron expression validator to our form
            if (this.formCtrl && this.name) {
                this.ngModelCtrl.$validators.testCronExpr = function (expression) {
                    return _this2.cronGenService.isValid(_this2.cronFormat, expression);
                };
            }
        }
    }, {
        key: 'setActiveTab',
        value: function setActiveTab($event, tab) {
            $event.preventDefault();
            if (!this.ngDisabled) {
                this.activeTab = tab;
                this.regenerateCron();
            }
        }
    }, {
        key: 'dayDisplay',
        value: function dayDisplay(day) {
            var DAY_LOOKUPS = {
                'SUN': this.filter('translate')('SUNDAY'),
                'MON': this.filter('translate')('MONDAY'),
                'TUE': this.filter('translate')('TUESDAY'),
                'WED': this.filter('translate')('WEDNESDAY'),
                'THU': this.filter('translate')('THURSDAY'),
                'FRI': this.filter('translate')('FRIDAY'),
                'SAT': this.filter('translate')('SATURDAY')
            };
            return DAY_LOOKUPS[day];
        }
    }, {
        key: 'monthWeekDisplay',
        value: function monthWeekDisplay(monthWeekNumber) {
            var MONTH_WEEK_LOOKUPS = {
                '#1': this.filter('translate')('FIRST'),
                '#2': this.filter('translate')('SECOND'),
                '#3': this.filter('translate')('THIRD'),
                '#4': this.filter('translate')('FOURTH'),
                '#5': this.filter('translate')('FIFTH'),
                'L': this.filter('translate')('LAST')
            };
            return MONTH_WEEK_LOOKUPS[monthWeekNumber];
        }
    }, {
        key: 'monthDisplay',
        value: function monthDisplay(monthNumber) {
            var MONTH_LOOKUPS = {
                '1': this.filter('translate')('JANUARY'),
                '2': this.filter('translate')('FEBRUARY'),
                '3': this.filter('translate')('MARCH'),
                '4': this.filter('translate')('APRIL'),
                '5': this.filter('translate')('MAY'),
                '6': this.filter('translate')('JUNE'),
                '7': this.filter('translate')('JULY'),
                '8': this.filter('translate')('AUGUST'),
                '9': this.filter('translate')('SEPTEMBER'),
                '10': this.filter('translate')('OCTOBER'),
                '11': this.filter('translate')('NOVEMBER'),
                '12': this.filter('translate')('DECEMBER')
            };
            return MONTH_LOOKUPS[monthNumber];
        }
    }, {
        key: 'monthDayDisplay',
        value: function monthDayDisplay(monthDay) {
            if (monthDay === 'L') {
                return this.filter('translate')('LAST_DAY');
            } else if (monthDay === 'LW') {
                return this.filter('translate')('LAST_WEEKDAY');
            } else if (monthDay === '1W') {
                return this.filter('translate')('FIRST_WEEKDAY');
            } else {
                return '' + monthDay + this.cronGenService.appendInt(monthDay) + ' ' + this.filter('translate')('DAY');
            }
        }
    }, {
        key: 'processHour',
        value: function processHour(hours) {
            if (this.parsedOptions.use24HourTime) {
                return hours;
            } else {
                return (hours + 11) % 12 + 1;
            }
        }
    }, {
        key: 'getHourType',
        value: function getHourType(hours) {
            return this.parsedOptions.use24HourTime ? null : hours >= 12 ? 'PM' : 'AM';
        }
    }, {
        key: 'hourToCron',
        value: function hourToCron(hour, hourType) {
            if (this.parsedOptions.use24HourTime) {
                return hour;
            } else {
                return hourType === 'AM' ? hour === 12 ? 0 : hour : hour === 12 ? 12 : hour + 12;
            }
        }
    }, {
        key: 'mergeDefaultOptions',
        value: function mergeDefaultOptions(options) {
            return angular.extend({
                formInputClass: 'form-control cron-gen-input',
                formSelectClass: 'form-control cron-gen-select',
                formRadioClass: 'form-control-static cron-gen-radio',
                formCheckboxClass: 'form-control-static cron-gen-checkbox',
                hideMinutesTab: false,
                hideHourlyTab: false,
                hideDailyTab: false,
                hideWeeklyTab: false,
                hideMonthlyTab: false,
                hideYearlyTab: false,
                hideAdvancedTab: true,
                use24HourTime: false,
                hideSeconds: false,
                language: 'en'
            }, options);
        }
    }, {
        key: 'regenerateCron',
        value: function regenerateCron() {
            var _this3 = this;

            this.currentState = States.DIRTY;
            switch (this.activeTab) {
                case 'minutes':
                    this.ngModel = this.state.minutes.seconds + ' 0/' + this.state.minutes.minutes + ' * 1/1 * ? *';
                    break;
                case 'hourly':
                    this.ngModel = this.state.hourly.seconds + ' ' + this.state.hourly.minutes + ' 0/' + this.state.hourly.hours + ' 1/1 * ? *';
                    break;
                case 'daily':
                    switch (this.state.daily.subTab) {
                        case 'everyDays':
                            this.ngModel = this.state.daily.everyDays.seconds + ' ' + this.state.daily.everyDays.minutes + ' ' + this.hourToCron(this.state.daily.everyDays.hours, this.state.daily.everyDays.hourType) + ' 1/' + this.state.daily.everyDays.days + ' * ? *';
                            break;
                        case 'everyWeekDay':
                            this.ngModel = this.state.daily.everyWeekDay.seconds + ' ' + this.state.daily.everyWeekDay.minutes + ' ' + this.hourToCron(this.state.daily.everyWeekDay.hours, this.state.daily.everyWeekDay.hourType) + ' ? * MON-FRI *';
                            break;
                        default:
                            throw 'Invalid cron daily subtab selection';
                    }
                    break;
                case 'weekly':
                    var days = this.selectOptions.days.reduce(function (acc, day) {
                        return _this3.state.weekly[day] ? acc.concat([day]) : acc;
                    }, []).join(',');
                    this.ngModel = this.state.weekly.seconds + ' ' + this.state.weekly.minutes + ' ' + this.hourToCron(this.state.weekly.hours, this.state.weekly.hourType) + ' ? * ' + days + ' *';
                    break;
                case 'monthly':
                    switch (this.state.monthly.subTab) {
                        case 'specificDay':
                            this.ngModel = this.state.monthly.specificDay.seconds + ' ' + this.state.monthly.specificDay.minutes + ' ' + this.hourToCron(this.state.monthly.specificDay.hours, this.state.monthly.specificDay.hourType) + ' ' + this.state.monthly.specificDay.day + ' 1/' + this.state.monthly.specificDay.months + ' ? *';
                            break;
                        case 'specificWeekDay':
                            this.ngModel = this.state.monthly.specificWeekDay.seconds + ' ' + this.state.monthly.specificWeekDay.minutes + ' ' + this.hourToCron(this.state.monthly.specificWeekDay.hours, this.state.monthly.specificWeekDay.hourType) + ' ? 1/' + this.state.monthly.specificWeekDay.months + ' ' + this.state.monthly.specificWeekDay.day + this.state.monthly.specificWeekDay.monthWeek + ' *';
                            break;
                        default:
                            throw 'Invalid cron monthly subtab selection';
                    }
                    break;
                case 'yearly':
                    switch (this.state.yearly.subTab) {
                        case 'specificMonthDay':
                            this.ngModel = this.state.yearly.specificMonthDay.seconds + ' ' + this.state.yearly.specificMonthDay.minutes + ' ' + this.hourToCron(this.state.yearly.specificMonthDay.hours, this.state.yearly.specificMonthDay.hourType) + ' ' + this.state.yearly.specificMonthDay.day + ' ' + this.state.yearly.specificMonthDay.month + ' ? *';
                            break;
                        case 'specificMonthWeek':
                            this.ngModel = this.state.yearly.specificMonthWeek.seconds + ' ' + this.state.yearly.specificMonthWeek.minutes + ' ' + this.hourToCron(this.state.yearly.specificMonthWeek.hours, this.state.yearly.specificMonthWeek.hourType) + ' ? ' + this.state.yearly.specificMonthWeek.month + ' ' + this.state.yearly.specificMonthWeek.day + this.state.yearly.specificMonthWeek.monthWeek + ' *';
                            break;
                        default:
                            throw 'Invalid cron yearly subtab selection';
                    }
                    break;
                case 'advanced':
                    this.ngModel = this.state.advanced.expression;
                    break;
                default:
                    throw 'Invalid cron active tab selection';
            }
        }
    }, {
        key: 'handleModelChange',
        value: function handleModelChange(cron) {
            var _this4 = this;

            if (this.currentState === States.DIRTY) {
                this.currentState = States.CLEAN;
                return;
            } else {
                this.currentState = States.CLEAN;
            }

            var segments = cron.split(' ');
            if (segments.length === 6 || segments.length === 7) {
                var _segments = slicedToArray(segments, 6),
                    seconds = _segments[0],
                    minutes = _segments[1],
                    hours = _segments[2],
                    dayOfMonth = _segments[3],
                    month = _segments[4],
                    dayOfWeek = _segments[5];

                if (cron.match(/\d+ 0\/\d+ \* 1\/1 \* \? \*/)) {
                    this.activeTab = 'minutes';
                    this.state.minutes.minutes = parseInt(minutes.substring(2));
                    this.state.minutes.seconds = parseInt(seconds);
                } else if (cron.match(/\d+ \d+ 0\/\d+ 1\/1 \* \? \*/)) {
                    this.activeTab = 'hourly';
                    this.state.hourly.hours = parseInt(hours.substring(2));
                    this.state.hourly.minutes = parseInt(minutes);
                    this.state.hourly.seconds = parseInt(seconds);
                } else if (cron.match(/\d+ \d+ \d+ 1\/\d+ \* \? \*/)) {
                    this.activeTab = 'daily';
                    this.state.daily.subTab = 'everyDays';
                    this.state.daily.everyDays.days = parseInt(dayOfMonth.substring(2));
                    var parsedHours = parseInt(hours);
                    this.state.daily.everyDays.hours = this.processHour(parsedHours);
                    this.state.daily.everyDays.hourType = this.getHourType(parsedHours);
                    this.state.daily.everyDays.minutes = parseInt(minutes);
                    this.state.daily.everyDays.seconds = parseInt(seconds);
                } else if (cron.match(/\d+ \d+ \d+ \? \* MON-FRI \*/)) {
                    this.activeTab = 'daily';
                    this.state.daily.subTab = 'everyWeekDay';
                    var _parsedHours = parseInt(hours);
                    this.state.daily.everyWeekDay.hours = this.processHour(_parsedHours);
                    this.state.daily.everyWeekDay.hourType = this.getHourType(_parsedHours);
                    this.state.daily.everyWeekDay.minutes = parseInt(minutes);
                    this.state.daily.everyWeekDay.seconds = parseInt(seconds);
                } else if (cron.match(/\d+ \d+ \d+ \? \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
                    this.activeTab = 'weekly';
                    this.selectOptions.days.forEach(function (weekDay) {
                        return _this4.state.weekly[weekDay] = false;
                    });
                    dayOfWeek.split(',').forEach(function (weekDay) {
                        return _this4.state.weekly[weekDay] = true;
                    });
                    var _parsedHours2 = parseInt(hours);
                    this.state.weekly.hours = this.processHour(_parsedHours2);
                    this.state.weekly.hourType = this.getHourType(_parsedHours2);
                    this.state.weekly.minutes = parseInt(minutes);
                    this.state.weekly.seconds = parseInt(seconds);
                } else if (cron.match(/\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ \? \*/)) {
                    this.activeTab = 'monthly';
                    this.state.monthly.subTab = 'specificDay';
                    this.state.monthly.specificDay.day = dayOfMonth;
                    this.state.monthly.specificDay.months = parseInt(month.substring(2));
                    var _parsedHours3 = parseInt(hours);
                    this.state.monthly.specificDay.hours = this.processHour(_parsedHours3);
                    this.state.monthly.specificDay.hourType = this.getHourType(_parsedHours3);
                    this.state.monthly.specificDay.minutes = parseInt(minutes);
                    this.state.monthly.specificDay.seconds = parseInt(seconds);
                } else if (cron.match(/\d+ \d+ \d+ \? 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
                    var day = dayOfWeek.substr(0, 3);
                    var monthWeek = dayOfWeek.substr(3);
                    this.activeTab = 'monthly';
                    this.state.monthly.subTab = 'specificWeekDay';
                    this.state.monthly.specificWeekDay.monthWeek = monthWeek;
                    this.state.monthly.specificWeekDay.day = day;
                    this.state.monthly.specificWeekDay.months = parseInt(month.substring(2));
                    var _parsedHours4 = parseInt(hours);
                    this.state.monthly.specificWeekDay.hours = this.processHour(_parsedHours4);
                    this.state.monthly.specificWeekDay.hourType = this.getHourType(_parsedHours4);
                    this.state.monthly.specificWeekDay.minutes = parseInt(minutes);
                    this.state.monthly.specificWeekDay.seconds = parseInt(seconds);
                } else if (cron.match(/\d+ \d+ \d+ (\d+|L|LW|1W) \d+ \? \*/)) {
                    this.activeTab = 'yearly';
                    this.state.yearly.subTab = 'specificMonthDay';
                    this.state.yearly.specificMonthDay.month = parseInt(month);
                    this.state.yearly.specificMonthDay.day = dayOfMonth;
                    var _parsedHours5 = parseInt(hours);
                    this.state.yearly.specificMonthDay.hours = this.processHour(_parsedHours5);
                    this.state.yearly.specificMonthDay.hourType = this.getHourType(_parsedHours5);
                    this.state.yearly.specificMonthDay.minutes = parseInt(minutes);
                    this.state.yearly.specificMonthDay.seconds = parseInt(seconds);
                } else if (cron.match(/\d+ \d+ \d+ \? \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
                    var _day = dayOfWeek.substr(0, 3);
                    var _monthWeek = dayOfWeek.substr(3);
                    this.activeTab = 'yearly';
                    this.state.yearly.subTab = 'specificMonthWeek';
                    this.state.yearly.specificMonthWeek.monthWeek = _monthWeek;
                    this.state.yearly.specificMonthWeek.day = _day;
                    this.state.yearly.specificMonthWeek.month = parseInt(month);
                    var _parsedHours6 = parseInt(hours);
                    this.state.yearly.specificMonthWeek.hours = this.processHour(_parsedHours6);
                    this.state.yearly.specificMonthWeek.hourType = this.getHourType(_parsedHours6);
                    this.state.yearly.specificMonthWeek.minutes = parseInt(minutes);
                    this.state.yearly.specificMonthWeek.seconds = parseInt(seconds);
                } else {
                    this.activeTab = 'advanced';
                    this.state.advanced.expression = cron;
                }
            } else {
                throw 'Unsupported cron expression. Expression must be 6 or 7 segments';
            }
        }
    }]);
    return CronGenComponent;
}();

var QUARTZ_REGEX = /^\s*($|#|\w+\s*=|(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?(?:,(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?)*)\s+(\?|\*|(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?(?:,(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?)*)\s+(\?|\*|(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\?|\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\s+(\?|\*|(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-|\/|\,|#)(?:[1-5]))?(?:L)?(?:,(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-|\/|\,|#)(?:[1-5]))?(?:L)?)*|\?|\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\s)+(\?|\*|(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?(?:,(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?)*))$/;

var CronGenService = function () {
    CronGenService.$inject = ["$filter"];
    function CronGenService($filter) {
        classCallCheck(this, CronGenService);

        this.filter = $filter;
    }

    createClass(CronGenService, [{
        key: 'isValid',
        value: function isValid(cronFormat, expression) {
            var formattedExpression = expression.toUpperCase();
            switch (cronFormat) {
                case 'quartz':
                    return !!formattedExpression.match(QUARTZ_REGEX);
                default:
                    throw 'Desired cron format (' + cronFormat + ') is not available';
            }
        }
    }, {
        key: 'appendInt',
        value: function appendInt(number) {
            var value = '' + number;
            if (value.length > 1) {
                var secondToLastDigit = value.charAt(value.length - 2);
                if (secondToLastDigit === '1') {
                    return this.filter('translate')('CARDINAL_PREFIX');
                }
            }
            var lastDigit = value.charAt(value.length - 1);
            switch (lastDigit) {
                case '1':
                    return this.filter('translate')('FIRST_PREFIX');
                case '2':
                    return this.filter('translate')('SECOND_PREFIX');
                case '3':
                    return this.filter('translate')('THIRD_PREFIX');
                default:
                    return this.filter('translate')('CARDINAL_PREFIX');
            }
        }
    }, {
        key: 'padNumber',
        value: function padNumber(number) {
            return ('' + number).length === 1 ? '0' + number : '' + number;
        }
    }, {
        key: 'range',
        value: function range(start, end) {
            if (typeof end === 'undefined') {
                end = start;
                start = 0;
            }

            if (start < 0 || end < 0) throw 'Range values must be positive values';

            if (end > start) {
                return [].concat(toConsumableArray(new Array(end - start))).map(function (val, idx) {
                    return idx + start;
                });
            } else if (start < end) {
                return [].concat(toConsumableArray(new Array(start - end))).map(function (val, idx) {
                    return end - idx;
                });
            } else return new Array();
        }
    }, {
        key: 'selectOptions',
        value: function selectOptions() {
            return {
                months: this.range(1, 13),
                monthWeeks: ['#1', '#2', '#3', '#4', '#5', 'L'],
                days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                minutes: this.range(1, 60),
                fullMinutes: this.range(60),
                seconds: this.range(60),
                hours: this.range(1, 24),
                monthDays: this.range(1, 32),
                monthDaysWithLasts: ['1W'].concat(toConsumableArray([].concat(toConsumableArray(new Array(31))).map(function (val, idx) {
                    return '' + (idx + 1);
                })), ['LW', 'L'])
            };
        }
    }]);
    return CronGenService;
}();

var CronGenTimeSelect = function CronGenTimeSelect($scope, cronGenService) {
    'ngInject';

    var _this = this;

    classCallCheck(this, CronGenTimeSelect);
    this.cronGenService = cronGenService;

    this.selectOptions = {
        minutes: cronGenService.range(60),
        seconds: cronGenService.range(60),
        hourTypes: ['AM', 'PM']
    };

    $scope.$watch('$ctrl.use24HourTime', function () {
        _this.selectOptions.hours = _this.use24HourTime ? _this.cronGenService.range(24) : _this.cronGenService.range(1, 13);
    });
};
CronGenTimeSelect.$inject = ["$scope", "cronGenService"];

angular.module('angular-cron-gen', ['pascalprecht.translate']).config(["$translateProvider", function ($translateProvider) {
    $translateProvider.translations('en', {
        'MINUTES': 'Minutes',
        'HOURLY': 'Hourly',
        'DAILY': 'Daily',
        'WEEKLY': 'Weekly',
        'MONTHLY': 'Monthly',
        'YEARLY': 'Yearly',
        'ADVANCED': 'Advanced',
        'EVERY': 'Every',
        'MINUTE': 'minute(s)',
        'ON_SECOND': 'on second',
        'HOUR_ON_MINUTE': 'hour(s) on minute',
        'AND_SECOND': 'and second',
        'DAY_AT': 'day(s) at',
        'EVERY_WEEK_WORKING_DAY': 'Every week day (Monday through Friday) at',
        'MONDAY': 'Monday',
        'TUESDAY': 'Tuesday',
        'WEDNESDAY': 'Wednesday',
        'THURSDAY': 'Thursday',
        'FRIDAY': 'Friday',
        'SATURDAY': 'Saturday',
        'SUNDAY': 'Sunday',
        'START_TIME': 'Start time',
        'ON_THE': 'On the',
        'OF_EVERY': 'of every',
        'MONTHS_AT': 'month(s) at',
        'AT': 'at',
        'OF': 'of',
        'CRON_EXPRESSION': 'Cron Expression',
        'MORE_DETAILS': 'More details about how to create these expressions can be found',
        'HERE': 'here',
        'LAST_DAY': 'Last day',
        'LAST_WEEKDAY': 'Last Weekday',
        'FIRST_WEEKDAY': 'First Weekday',
        'DAY': 'Day',
        'FIRST_PREFIX': 'st',
        'SECOND_PREFIX': 'nd',
        'THIRD_PREFIX': 'rd',
        'CARDINAL_PREFIX': 'th',
        'FIRST': 'First',
        'SECOND': 'Second',
        'THIRD': 'Third',
        'FOURTH': 'Fourth',
        'FIFTH': 'Fifth',
        'LAST': 'Last',
        'JANUARY': 'January',
        'FEBRUARY': 'February',
        'MARCH': 'March',
        'APRIL': 'April',
        'MAY': 'May',
        'JUNE': 'June',
        'JULY': 'July',
        'AUGUST': 'August',
        'SEPTEMBER': 'September',
        'OCTOBER': 'October',
        'NOVEMBER': 'November',
        'DECEMBER': 'December'
    }).translations('it', {
        'MINUTES': 'Minuti',
        'HOURLY': 'Orario',
        'DAILY': 'Giornaliero',
        'WEEKLY': 'Settimanale',
        'MONTHLY': 'Mensile',
        'YEARLY': 'Annuale',
        'ADVANCED': 'Avanzato',
        'EVERY': 'Ogni',
        'MINUTE': 'minuto/i',
        'ON_SECOND': 'al secondo',
        'HOUR_ON_MINUTE': 'ora/e al minuto',
        'AND_SECOND': 'e secondi',
        'DAY_AT': 'giorno/i alle',
        'EVERY_WEEK_WORKING_DAY': "Ogni giorno della settimana (dal Lunedi' al Venerdi') alle",
        'MONDAY': "Lunedi'",
        'TUESDAY': "Martedi'",
        'WEDNESDAY': "Mercoledi'",
        'THURSDAY': "Giovedi'",
        'FRIDAY': "Venerdi'",
        'SATURDAY': 'Sabato',
        'SUNDAY': 'Domenica',
        'START_TIME': 'Inizio alle',
        'ON_THE': 'Il',
        'OF_EVERY': 'di ogni',
        'MONTHS_AT': 'mese/i il',
        'AT': 'il',
        'OF': 'di',
        'CRON_EXPRESSION': 'Sintassi Cron',
        'MORE_DETAILS': 'Maggiori informazioni sulla sintassi Cron li potete trovare',
        'HERE': 'qui',
        'LAST_DAY': 'Ultimo giorno',
        'LAST_WEEKDAY': 'Fine settimana',
        'FIRST_WEEKDAY': 'Inizio settimana',
        'DAY': 'Giorno',
        'FIRST_PREFIX': '',
        'SECOND_PREFIX': '',
        'THIRD_PREFIX': '',
        'CARDINAL_PREFIX': '',
        'FIRST': 'Primo',
        'SECOND': 'Secondo',
        'THIRD': 'Terzo',
        'FOURTH': 'Quarto',
        'FIFTH': 'Quinto',
        'LAST': 'Ultimo',
        'JANUARY': 'Gennaio',
        'FEBRUARY': 'Febbraio',
        'MARCH': 'Marzo',
        'APRIL': 'Aprile',
        'MAY': 'Maggio',
        'JUNE': 'Giugno',
        'JULY': 'Luglio',
        'AUGUST': 'Agosto',
        'SEPTEMBER': 'Settembre',
        'OCTOBER': 'Ottobre',
        'NOVEMBER': 'Novembre',
        'DECEMBER': 'Dicembre'
    }).translations('de', {
        'MINUTES': 'Minütlich',
        'HOURLY': 'Stündlich',
        'DAILY': 'Täglich',
        'WEEKLY': 'Wöchentlich',
        'MONTHLY': 'Monatlich',
        'YEARLY': 'Jährlich',
        'ADVANCED': 'Cron Ausdruck',
        'EVERY': 'Jede(n)',
        'MINUTE': 'Minute(n)',
        'ON_SECOND': 'auf Sekunde',
        'HOUR_ON_MINUTE': 'Stunde(n) auf Minute',
        'AND_SECOND': 'und SeKunde',
        'DAY_AT': 'Tag(e) um',
        'EVERY_WEEK_WORKING_DAY': "Jeden Wochentag (Montag bis Freitag) um",
        'MONDAY': "Montag'",
        'TUESDAY': "Dienstag'",
        'WEDNESDAY': "Mittwoch'",
        'THURSDAY': "Donnerstag'",
        'FRIDAY': "Freitag'",
        'SATURDAY': 'Samstag',
        'SUNDAY': 'Sonntag',
        'START_TIME': 'Startzeit',
        'ON_THE': 'Am',
        'OF_EVERY': 'an jedem',
        'MONTHS_AT': 'Monat(e) um',
        'AT': 'um',
        'OF': 'im',
        'CRON_EXPRESSION': 'Cron Ausdruck',
        'MORE_DETAILS': 'Weitere Informationen zum Erstellen dieser Ausdrücke finden Sie ',
        'HERE': 'hier',
        'LAST_DAY': 'letzter Tag',
        'LAST_WEEKDAY': 'letzter Wochentag',
        'FIRST_WEEKDAY': 'erster Wochentag',
        'DAY': 'Tag',
        'FIRST_PREFIX': '',
        'SECOND_PREFIX': '',
        'THIRD_PREFIX': '',
        'CARDINAL_PREFIX': '',
        'FIRST': 'First',
        'SECOND': 'Second',
        'THIRD': 'Third',
        'FOURTH': 'Fourth',
        'FIFTH': 'Fifth',
        'LAST': 'Last',
        'JANUARY': 'January',
        'FEBRUARY': 'February',
        'MARCH': 'March',
        'APRIL': 'April',
        'MAY': 'May',
        'JUNE': 'June',
        'JULY': 'July',
        'AUGUST': 'August',
        'SEPTEMBER': 'September',
        'OCTOBER': 'October',
        'NOVEMBER': 'November',
        'DECEMBER': 'December'
    });
}]).service('cronGenService', CronGenService).component('cronGenTimeSelect', {
    bindings: {
        isDisabled: '<',
        onChange: '&',
        isRequired: '<',
        model: '=',
        selectClass: '<',
        use24HourTime: '<',
        hideSeconds: '<',
        namePrefix: '@'
    },
    templateUrl: 'angular-cron-gen/cron-gen-time-select.html',
    controller: CronGenTimeSelect
}).component('cronGen', {
    bindings: {
        ngModel: '=',
        ngDisabled: '<',
        options: '<',
        cronFormat: '@',
        templateUrl: '@',
        name: '@'
    },
    require: {
        ngModelCtrl: 'ngModel',
        ngDisabledCtrl: '?ngDisabled',
        formCtrl: '^?form'
    },
    templateUrl: ["$attrs", function templateUrl($attrs) {
        'ngInject';

        return $attrs.templateUrl || 'angular-cron-gen/cron-gen.html';
    }],

    controller: CronGenComponent
});

}());
