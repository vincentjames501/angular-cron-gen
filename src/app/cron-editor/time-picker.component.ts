import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";

@Component({
    selector: "time-picker",
    templateUrl: "./time-picker.template.html"
})
export class TimePickerComponent implements OnInit {
    @Output() public onChange = new EventEmitter();

    @Input() public disabled: boolean;
    @Input() public model: any;
    @Input() public selectClass: string;
    @Input() public use24HourTime: boolean;
    @Input() public hideSeconds: boolean;

    public hours: number[];
    public minutes: number[];
    public seconds: number[];
    public hourTypes: string[];

    public async ngOnInit() {
        this.hours = this.use24HourTime ? this.range(0, 23) : this.range(0, 12);
        this.minutes = this.range(0, 59);
        this.seconds = this.range(0, 59);
        this.hourTypes = ["AM", "PM"];
    }

    private range(start: number, end: number): number[] {
        const length = end - start + 1;
        return Array.apply(null, Array(length)).map((_, i) => i + start);
    }
}