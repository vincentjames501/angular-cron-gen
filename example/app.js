angular.module('ExampleApp', ['angular-cron-gen'])
    .controller('ExampleCtrl', ['$scope', function ($scope) {
        $scope.cronExpression = '0 8 9 9 1/8 ? *';
        $scope.cronOptions = {
            hideAdvancedTab: false
        };
        $scope.isCronDisabled = false;
    }]);
