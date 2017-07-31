cron-editor
===

A library that helps the user graphically build a CRON expression using Angular 2+. It is a fork of the  vincentjames501's [angular-cron-gen](https://github.com/vincentjames501/angular-cron-gen) for AngularJS 1.5+.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.2.0. To run the sample app just run `npm run start` and go to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Usage:

1. Install the npm package:
    ```
    $ npm i cron-editor -S
    ```

2. Import the module in your own module:

    ```ts
    import { CronEditorModule } from "cron-editor/cron-editor";

    @NgModule({
        imports: [..., CronEditorModule],
    ...
    })
    export class MyModule {
    }
    ```

3. Use the component in your html code:

    ```html
    <cron-editor [(cron)]="cronExpression"></cron-editor>
    ```

4. That's it, you're done!

## Options

```html
<cron-editor [(cron)]="cronExpression" [options]="cronOptions"></cron-editor>
```

```ts
import { CronOptions } from "cron-editor/cron-editor";

@Component({
    ...
})
export class MyComponent {
   public cronOptions: CronOptions = {
       formInputClass: 'form-control cron-editor-input',
       formSelectClass: 'form-control cron-editor-select',
       formRadioClass: 'cron-editor-radio',
       formCheckboxClass: 'cron-editor-checkbox',
       
       defaultTime: "10:00:00",

       hideMinutesTab: false,
       hideHourlyTab: false,
       hideDailyTab: false,
       hideWeeklyTab: false,
       hideMonthlyTab: false,
       hideYearlyTab: false,
       hideAdvancedTab: true,
       use24HourTime: true,
       hideSeconds: false
    };
}
```

## License:
Licensed under the MIT license