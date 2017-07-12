import { CronGenComponent } from './cron-gen.component';
import { CronGenService } from './cron-gen.service';
import { CronGenTimeSelect } from './cron-gen-time-select.component';

angular.module('angular-cron-gen', ['pascalprecht.translate'])
    .config(function ($translateProvider) {
        $translateProvider
            .translations('en', {
                'MINUTES': 'Minutes',
                'HOURLY': 'Hourly',
                'DAILY': 'Daily',
                'WEEKLY': 'Weekly',
                'MONTHLY': 'Monthly',
                'YEARLY': 'Yearly',
                'ADVANCED': 'Advanced',
                'EVERY' : 'Every',
                'MINUTE' : 'minute(s)',
                'ON_SECOND' : 'on second',
                'HOUR_ON_MINUTE' : 'hour(s) on minute',
                'AND_SECOND' : 'and second',
                'DAY_AT' : 'day(s) at',
                'EVERY_WEEK_WORKING_DAY' : 'Every week day (Monday through Friday) at',
                'MONDAY' : 'Monday',
                'TUESDAY' : 'Tuesday',
                'WEDNESDAY' :'Wednesday',
                'THURSDAY' :'Thursday',
                'FRIDAY' :'Friday',
                'SATURDAY' :'Saturday',
                'SUNDAY' :'Sunday',
                'START_TIME' : 'Start time',
                'ON_THE' : 'On the',
                'OF_EVERY' : 'of every',
                'MONTHS_AT' : 'month(s) at',
                'AT' : 'at',
                'OF' : 'of',
                'CRON_EXPRESSION' : 'Cron Expression',
                'MORE_DETAILS' : 'More details about how to create these expressions can be found',
                'HERE' : 'here'
            })
            .translations('it', {
                'MINUTES': 'Minuti',
                'HOURLY': 'Orario',
                'DAILY': 'Giornaliero',
                'WEEKLY': 'Settimanale',
                'MONTHLY': 'Mensile',
                'YEARLY': 'Annuale',
                'ADVANCED': 'Avanzato',
                'EVERY' : 'Ogni',
                'MINUTE' : 'minuto/i',
                'ON_SECOND' : 'al secondo',
                'HOUR_ON_MINUTE' : 'ora/e al minuto',
                'AND_SECOND' : 'e secondi',
                'DAY_AT' : 'giorno/i alle',
                'EVERY_WEEK_WORKING_DAY' : "Ogni giorno della settimana (dal Lunedi' al Venerdi') alle",
                'MONDAY' : "Lunedi'",
                'TUESDAY' : "Martedi'",
                'WEDNESDAY' : "Mercoledi'",
                'THURSDAY' : "Giovedi'",
                'FRIDAY' : "Venerdi'",
                'SATURDAY' :'Sabato',
                'SUNDAY' :'Domenica',
                'START_TIME' : 'Inizio alle',
                'ON_THE' : 'Il',
                'OF_EVERY' : 'di ogni',
                'MONTHS_AT' : 'mese/i il',
                'AT' : 'il',
                'OF' : 'di',
                'CRON_EXPRESSION' : 'Sintassi Cron',
                'MORE_DETAILS' : 'Maggiori informazioni sulla sintassi Cron li potete trovare',
                'HERE' : 'qui'
            });
    })
    .service('cronGenService', CronGenService)
    .component('cronGenTimeSelect', {
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
    })
    .component('cronGen', {
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
        templateUrl($attrs) {
            'ngInject';
            return $attrs.templateUrl || 'angular-cron-gen/cron-gen.html';
        },
        controller: CronGenComponent
    });
