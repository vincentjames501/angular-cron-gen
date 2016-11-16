export class CronGenTimeSelect {
    constructor($scope) {
        'ngInject';
        this.selectOptions = {
            minutes: [...new Array(60).keys()],
            hourTypes: ['AM', 'PM']
        };
        $scope.$watch('$ctrl.use24HourTime', () => {
            this.selectOptions.hours = this.use24HourTime ? [...new Array(24).keys()] : [...new Array(12).keys()].map(x => x + 1);
        });
    }

    padNumber(number) {
        return `${number}`.length === 1 ? `0${number}` : `${number}`;
    }
}