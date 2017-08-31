const QUARTZ_REGEX = /^\s*($|#|\w+\s*=|(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?(?:,(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?)*)\s+(\?|\*|(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?(?:,(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?)*)\s+(\?|\*|(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\?|\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\s+(\?|\*|(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-|\/|\,|#)(?:[1-5]))?(?:L)?(?:,(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-|\/|\,|#)(?:[1-5]))?(?:L)?)*|\?|\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\s)+(\?|\*|(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?(?:,(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?)*))$/;

export class CronGenService {
    constructor($filter) {
        this.filter = $filter;
    }

    isValid(cronFormat, expression) {
        const formattedExpression = expression.toUpperCase();
        switch (cronFormat) {
            case 'quartz':
                return !!formattedExpression.match(QUARTZ_REGEX);
            default:
                throw `Desired cron format (${cronFormat}) is not available`;
        }
    }

    appendInt(number) {
        const value = `${number}`;
        if (value.length > 1) {
            const secondToLastDigit = value.charAt(value.length - 2);
            if (secondToLastDigit === '1') {
                return this.filter('translate')('CARDINAL_PREFIX');
            }
        }
        const lastDigit = value.charAt(value.length - 1);
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

    padNumber(number) {
        return `${number}`.length === 1 ? `0${number}` : `${number}`;
    }

    range(start, end){
        if(typeof end === 'undefined') {
            end = start;
            start = 0;
        }

        if (start < 0 || end < 0)
            throw 'Range values must be positive values';

        if (end > start){
            return [...new Array(end-start)].map(function (val, idx){return idx + start;});
        }
        else if (start < end)
        {
            return [...new Array(start-end)].map(function (val, idx){return end - idx;});
        }
        else
            return new Array();
    }

    selectOptions(){
            return {
            months: this.range(1, 13),
            monthWeeks: ['#1', '#2', '#3', '#4', '#5', 'L'],
            days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            minutes: this.range(1, 60),
            fullMinutes: this.range(60),
            seconds: this.range(60),
            hours: this.range(1, 24),
            monthDays: this.range(1,32),
            monthDaysWithLasts: ['1W', ...[...new Array(31)].map((val, idx) => `${idx + 1}`), 'LW', 'L']
        };
    }


}