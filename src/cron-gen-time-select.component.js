export class CronGenTimeSelect {
    constructor($scope, cronGenService) {
        'ngInject';

        this.cronGenService = cronGenService;

        this.selectOptions = {
            minutes: cronGenService.range(60),
            seconds: cronGenService.range(60),
            hourTypes: ['AM', 'PM']
        };

        $scope.$watch('$ctrl.use24HourTime', () => {
            this.selectOptions.hours = this.use24HourTime ? this.cronGenService.range(24) : this.cronGenService.range(1,12);
        });
    }
}