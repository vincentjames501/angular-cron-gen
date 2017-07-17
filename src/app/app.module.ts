import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CronEditorModule } from './cron-editor/cron-editor.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, FormsModule, CronEditorModule],  
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
