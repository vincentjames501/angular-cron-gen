import {CronGenComponent} from './cron-gen.component';
import {CronGenService} from './cron-gen.service';
import {CronGenTimeSelect} from './cron-gen-time-select.component';

angular.module('angular-cron-gen', [])
    .service('cronGenService', CronGenService)
    .component('cronGenTimeSelect', {
        bindings: {
            isDisabled: '<',
            onChange: '&',
            isRequired: '<',
            model: '=',
            selectClass: '<',
            use24HourTime: '<',
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
