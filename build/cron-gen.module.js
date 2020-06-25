(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
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
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var ACCEPTABLE_CRON_FORMATS = ['quartz'];
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
    '#1': 'First',
    '#2': 'Second',
    '#3': 'Third',
    '#4': 'Fourth',
    '#5': 'Fifth',
    'L': 'Last'
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
    INIT: 1,
    DIRTY: 2,
    CLEAN: 3
  };
  var CronGenComponent = /*#__PURE__*/function () {
    CronGenComponent.$inject = ["$scope", "cronGenService"];
    function CronGenComponent($scope, cronGenService) {
      'ngInject';

      var _this = this;

      _classCallCheck(this, CronGenComponent);

      this.parsedOptions = this.mergeDefaultOptions(this.options);
      angular.extend(this, {
        cronGenService: cronGenService,
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
      }); //Validate our opts

      if (ACCEPTABLE_CRON_FORMATS.indexOf(this.cronFormat) == -1) {
        throw "Desired cron format (".concat(this.cronFormat, ") is not available");
      } //On model changes, update our state to reflect the user's input


      $scope.$watch('$ctrl.ngModel', function (cron) {
        return _this.handleModelChange(cron);
      }); // Watch for option changes

      $scope.$watch('$ctrl.options', function (options) {
        return _this.parsedOptions = _this.mergeDefaultOptions(options);
      }, true);
    }

    _createClass(CronGenComponent, [{
      key: "$onInit",
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
      key: "setActiveTab",
      value: function setActiveTab($event, tab) {
        $event.preventDefault();

        if (!this.ngDisabled) {
          this.activeTab = tab;
          this.regenerateCron();
        }
      }
    }, {
      key: "dayDisplay",
      value: function dayDisplay(day) {
        return DAY_LOOKUPS[day];
      }
    }, {
      key: "monthWeekDisplay",
      value: function monthWeekDisplay(monthWeekNumber) {
        return MONTH_WEEK_LOOKUPS[monthWeekNumber];
      }
    }, {
      key: "monthDisplay",
      value: function monthDisplay(monthNumber) {
        return MONTH_LOOKUPS[monthNumber];
      }
    }, {
      key: "monthDayDisplay",
      value: function monthDayDisplay(monthDay) {
        if (monthDay === 'L') {
          return 'Last Day';
        } else if (monthDay === 'LW') {
          return 'Last Weekday';
        } else if (monthDay === '1W') {
          return 'First Weekday';
        } else {
          return "".concat(monthDay).concat(this.cronGenService.appendInt(monthDay), " Day");
        }
      }
    }, {
      key: "processHour",
      value: function processHour(hours) {
        if (this.parsedOptions.use24HourTime) {
          return hours;
        } else {
          return (hours + 11) % 12 + 1;
        }
      }
    }, {
      key: "getHourType",
      value: function getHourType(hours) {
        return this.parsedOptions.use24HourTime ? null : hours >= 12 ? 'PM' : 'AM';
      }
    }, {
      key: "hourToCron",
      value: function hourToCron(hour, hourType) {
        if (this.parsedOptions.use24HourTime) {
          return hour;
        } else {
          return hourType === 'AM' ? hour === 12 ? 0 : hour : hour === 12 ? 12 : hour + 12;
        }
      }
    }, {
      key: "mergeDefaultOptions",
      value: function mergeDefaultOptions(options) {
        return angular.extend({
          formInputClass: 'form-control cron-gen-input',
          formSelectClass: 'form-control cron-gen-select',
          formRadioClass: 'cron-gen-radio',
          formCheckboxClass: 'cron-gen-checkbox',
          hideMinutesTab: false,
          hideHourlyTab: false,
          hideDailyTab: false,
          hideWeeklyTab: false,
          hideMonthlyTab: false,
          hideYearlyTab: false,
          hideAdvancedTab: true,
          use24HourTime: false,
          hideSeconds: false
        }, options);
      }
    }, {
      key: "regenerateCron",
      value: function regenerateCron() {
        var _this3 = this;

        this.currentState = States.DIRTY;

        switch (this.activeTab) {
          case 'minutes':
            this.ngModel = "".concat(this.state.minutes.seconds, " 0/").concat(this.state.minutes.minutes, " * 1/1 * ? *");
            break;

          case 'hourly':
            this.ngModel = "".concat(this.state.hourly.seconds, " ").concat(this.state.hourly.minutes, " 0/").concat(this.state.hourly.hours, " 1/1 * ? *");
            break;

          case 'daily':
            switch (this.state.daily.subTab) {
              case 'everyDays':
                this.ngModel = "".concat(this.state.daily.everyDays.seconds, " ").concat(this.state.daily.everyDays.minutes, " ").concat(this.hourToCron(this.state.daily.everyDays.hours, this.state.daily.everyDays.hourType), " 1/").concat(this.state.daily.everyDays.days, " * ? *");
                break;

              case 'everyWeekDay':
                this.ngModel = "".concat(this.state.daily.everyWeekDay.seconds, " ").concat(this.state.daily.everyWeekDay.minutes, " ").concat(this.hourToCron(this.state.daily.everyWeekDay.hours, this.state.daily.everyWeekDay.hourType), " ? * MON-FRI *");
                break;

              default:
                throw 'Invalid cron daily subtab selection';
            }

            break;

          case 'weekly':
            var days = this.selectOptions.days.reduce(function (acc, day) {
              return _this3.state.weekly[day] ? acc.concat([day]) : acc;
            }, []).join(',');
            this.ngModel = "".concat(this.state.weekly.seconds, " ").concat(this.state.weekly.minutes, " ").concat(this.hourToCron(this.state.weekly.hours, this.state.weekly.hourType), " ? * ").concat(days, " *");
            break;

          case 'monthly':
            switch (this.state.monthly.subTab) {
              case 'specificDay':
                this.ngModel = "".concat(this.state.monthly.specificDay.seconds, " ").concat(this.state.monthly.specificDay.minutes, " ").concat(this.hourToCron(this.state.monthly.specificDay.hours, this.state.monthly.specificDay.hourType), " ").concat(this.state.monthly.specificDay.day, " 1/").concat(this.state.monthly.specificDay.months, " ? *");
                break;

              case 'specificWeekDay':
                this.ngModel = "".concat(this.state.monthly.specificWeekDay.seconds, " ").concat(this.state.monthly.specificWeekDay.minutes, " ").concat(this.hourToCron(this.state.monthly.specificWeekDay.hours, this.state.monthly.specificWeekDay.hourType), " ? 1/").concat(this.state.monthly.specificWeekDay.months, " ").concat(this.state.monthly.specificWeekDay.day).concat(this.state.monthly.specificWeekDay.monthWeek, " *");
                break;

              default:
                throw 'Invalid cron monthly subtab selection';
            }

            break;

          case 'yearly':
            switch (this.state.yearly.subTab) {
              case 'specificMonthDay':
                this.ngModel = "".concat(this.state.yearly.specificMonthDay.seconds, " ").concat(this.state.yearly.specificMonthDay.minutes, " ").concat(this.hourToCron(this.state.yearly.specificMonthDay.hours, this.state.yearly.specificMonthDay.hourType), " ").concat(this.state.yearly.specificMonthDay.day, " ").concat(this.state.yearly.specificMonthDay.month, " ? *");
                break;

              case 'specificMonthWeek':
                this.ngModel = "".concat(this.state.yearly.specificMonthWeek.seconds, " ").concat(this.state.yearly.specificMonthWeek.minutes, " ").concat(this.hourToCron(this.state.yearly.specificMonthWeek.hours, this.state.yearly.specificMonthWeek.hourType), " ? ").concat(this.state.yearly.specificMonthWeek.month, " ").concat(this.state.yearly.specificMonthWeek.day).concat(this.state.yearly.specificMonthWeek.monthWeek, " *");
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
      key: "handleModelChange",
      value: function handleModelChange(cron) {
        var _this4 = this;

        if (this.currentState === States.DIRTY) {
          this.currentState = States.CLEAN;
          return;
        } else {
          this.currentState = States.CLEAN;
        }

        if (!cron) {
          return;
        }

        var segments = cron.split(' ');

        if (segments.length === 6 || segments.length === 7) {
          var _segments = _slicedToArray(segments, 6),
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
  var CronGenService = /*#__PURE__*/function () {
    function CronGenService() {
      _classCallCheck(this, CronGenService);
    }

    _createClass(CronGenService, [{
      key: "isValid",
      value: function isValid(cronFormat, expression) {
        if (!expression) {
          return false;
        }

        var formattedExpression = expression.toUpperCase();

        switch (cronFormat) {
          case 'quartz':
            return !!formattedExpression.match(QUARTZ_REGEX);

          default:
            throw "Desired cron format (".concat(cronFormat, ") is not available");
        }
      }
    }, {
      key: "appendInt",
      value: function appendInt(number) {
        var value = "".concat(number);

        if (value.length > 1) {
          var secondToLastDigit = value.charAt(value.length - 2);

          if (secondToLastDigit === '1') {
            return "th";
          }
        }

        var lastDigit = value.charAt(value.length - 1);

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
    }, {
      key: "padNumber",
      value: function padNumber(number) {
        return "".concat(number).length === 1 ? "0".concat(number) : "".concat(number);
      }
    }, {
      key: "range",
      value: function range(start, end) {
        if (typeof end === 'undefined') {
          end = start;
          start = 0;
        }

        if (start < 0 || end < 0) throw 'Range values must be positive values';

        if (end > start) {
          return _toConsumableArray(new Array(end - start)).map(function (val, idx) {
            return idx + start;
          });
        } else if (start < end) {
          return _toConsumableArray(new Array(start - end)).map(function (val, idx) {
            return end - idx;
          });
        } else {
          return [];
        }
      }
    }, {
      key: "selectOptions",
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
          monthDaysWithLasts: ['1W'].concat(_toConsumableArray(_toConsumableArray(new Array(31)).map(function (val, idx) {
            return "".concat(idx + 1);
          })), ['LW', 'L'])
        };
      }
    }]);

    return CronGenService;
  }();

  var CronGenTimeSelect = function CronGenTimeSelect($scope, cronGenService) {
    'ngInject';

    var _this = this;

    _classCallCheck(this, CronGenTimeSelect);

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

  angular.module('angular-cron-gen', []).service('cronGenService', CronGenService).component('cronGenTimeSelect', {
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
