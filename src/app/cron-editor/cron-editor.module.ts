import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CronGenComponent } from "./cron-editor.component";
import { CronGenService } from "./cron-editor.service";
import { TimePickerComponent } from "./time-picker.component";

@NgModule({
    imports: [CommonModule, FormsModule],
    exports: [CronGenComponent, TimePickerComponent],
    declarations: [CronGenComponent, TimePickerComponent],
    providers: [CronGenService]
})
export class CronEditorModule {
}
