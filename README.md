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
<cron-gen ng-model="cronExpression" options="cronOptions" ng-disabled="isCronDisabled"></cron-gen>
```

```js
angular.module('myApp', ['angular-cron-gen'])
  .controller('myController', ['$scope', ($scope) => {
    $scope.cronExpression = '0 0 0/3 1/1 * ? *';
    $scope.isCronDisabled = false;
    $scope.cronOptions = {
      templateUrl: 'your custom template', // Defaults to a bootstrap 3 template
      cronFormat: 'cron format' // Currently only compatible with 'quartz'
    };
  }])
```

## License:
Licensed under the MIT license
