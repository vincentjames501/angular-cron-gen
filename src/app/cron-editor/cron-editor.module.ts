import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CronGenComponent } from './cron-editor.component';
import { TimePickerComponent } from './cron-time-picker.component';

@NgModule({
    imports: [CommonModule, FormsModule],
    exports: [CronGenComponent, TimePickerComponent],
    declarations: [CronGenComponent, TimePickerComponent]
})
export class CronEditorModule {
}
