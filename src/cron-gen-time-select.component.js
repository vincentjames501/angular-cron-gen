export class CronGenTimeSelect {
    constructor($scope, cronGenService) {
        'ngInject';

        this.cronGenService = cronGenService;

        this.selectOptions = {
            minutes: [...new Array(60).keys()],
            seconds: [...new Array(60).keys()],
            hourTypes: ['AM', 'PM']
        };

        $scope.$watch('$ctrl.use24HourTime', () => {
            this.selectOptions.hours = this.use24HourTime ? [...new Array(24).keys()] : [...new Array(12).keys()].map(x => x + 1);
        });
    }
}