export class CronGenTimeSelect {
    constructor($scope, cronGenService) {
        'ngInject';

        this.cronGenService = cronGenService;

        this.selectOptions = {
            minutes: [...new Array(60)].map((val, idx) => idx),
            seconds: [...new Array(60)].map((val, idx) => idx),
            hourTypes: ['AM', 'PM']
        };

        $scope.$watch('$ctrl.use24HourTime', () => {
            this.selectOptions.hours = this.use24HourTime ? [...new Array(24)].map((val, idx) => idx) : [...new Array(12)].map((val, idx) => idx + 1);
        });
    }
}