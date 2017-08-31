angular-cron-gen
===================

A basic way to for users to graphically build a cron expression.

Demo can be found [here](https://vincentjames501.github.io/angular-cron-gen/).

**Requirements:** AngularJS 1.5+

## Usage:

1. Include the dependency in your app

    ```js
    angular.module('myApp', ['angular-cron-gen'])
    ```

2. Include the supplied JS and CSS file (or create your own CSS to override defaults).

    ```html
    <link rel='stylesheet' href='build/cron-gen.min.css' type='text/css' media='all' />
    <script type='text/javascript' src='build/cron-gen.min.js'></script>
    ```

3. That's it -- you're done!

#### Via bower:
```
$ bower install angular-cron-gen
```
#### Via npm:
```
$ npm install angular-cron-gen
```

## Options

```html
<cron-gen ng-model="cronExpression" 
          options="cronOptions" 
          template-url="your optional, custom template (Defaults to a bootstrap 3 template)"
          cron-format="quartz (Currently only compatible with 'quartz' and defaults to 'quartz')"
          ng-disabled="isCronDisabled">
</cron-gen>
```

```js
angular.module('myApp', ['angular-cron-gen'])
  .controller('myController', ['$scope', ($scope) => {
    $scope.cronExpression = '0 0 0/3 1/1 * ? *';
    $scope.isCronDisabled = false;
    $scope.cronOptions = {
      formInputClass: 'form-control cron-gen-input', // Form input class override
      formSelectClass: 'form-control cron-gen-select', // Select class override
      formRadioClass: 'cron-gen-radio', // Radio class override
      formCheckboxClass: 'cron-gen-checkbox', // Radio class override
      hideMinutesTab: false, // Whether to hide the minutes tab
      hideHourlyTab: false, // Whether to hide the hourly tab
      hideDailyTab: false, // Whether to hide the daily tab
      hideWeeklyTab: false, // Whether to hide the weekly tab
      hideMonthlyTab: false, // Whether to hide the monthly tab
      hideYearlyTab: false, // Whether to hide the yearly tab
      hideAdvancedTab: true, // Whether to hide the advanced tab
      use24HourTime: false, // Whether to show AM/PM on the time selectors
      hideSeconds: false // Whether to show/hide the seconds time picker
    };
  }])
```

## License:
Licensed under the MIT license
