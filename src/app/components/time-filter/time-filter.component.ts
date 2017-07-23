import {Component, OnInit} from '@angular/core';
import {IMyDateModel, IMyDpOptions} from 'mydatepicker';
import * as moment from 'moment';
import {NouiFormatter} from "ng2-nouislider";

export class TimeFormatter implements NouiFormatter {
  to(value: number): string {
    console.log("1) To : ", value);
    const h = Math.floor(value / 3600000);
    const m = Math.floor(value % 3600000 / 60000);
    const values = [h, m];
    let timeString: string = '';
    let i = 0;
    for (let v of values) {
      if (values[i] < 10) {
        timeString += '0';
      }

      timeString += values[i].toFixed(0);
      if (i < 1) {
        timeString += ':';
      }
      i++;
    }
    console.log("2) To : ", timeString);
    return timeString;
  };

  from(value: string): number {
    console.log("1) From : ", value);
    let v = value.split(':').map(parseInt);
    let time: number = 0;
    time += v[0] * 3600000;
    time += v[1] * 60000;
    console.log("2) From : ", time);
    return time;
  }
}

@Component({
  selector: 'time-filter',
  templateUrl: './time-filter.component.html',
  styleUrls: ['./time-filter.component.scss']
})
export class TimeFilterComponent {

  private rangeConfig: any = {
    behaviour: 'drag',
    connect: true,
    margin: 1,
    range: {
      min: 0,
      max: 86400000,
    },
    pips: {
      mode: 'values',
      values: [0, 3600000, 7200000, 10800000, 14400000, 18000000, 21600000, 25200000, 28800000, 32400000, 36000000, 39600000, 43200000, 46800000, 50400000, 54000000, 57600000, 61200000, 64800000, 68400000, 72000000, 75600000, 79200000, 82800000, 86400000],
      density: 1,
      stepped: true,
      format: new TimeFormatter()
    },
  };

  private rangeArr: number[];
  private currRange: number[];
  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    showDecreaseDateBtn: true,
    showIncreaseDateBtn: true,
  };

  private selectedDate: Date = moment().startOf('day').toDate();
  private datePickerDate: any;

  constructor() {

    this.datePickerDate = {
      date: {
        year: this.selectedDate.getFullYear(),
        month: this.selectedDate.getMonth() + 1,
        day: this.selectedDate.getDate()
      }
    };

    this.updateSlider();
  }

  onDateChanged(event: IMyDateModel) {
    // Update value of selDate variable
    this.selectedDate = event.jsdate;
    this.updateSlider();
  }

  updateSlider() {
    console.log([this.selectedDate.getTime(), moment(this.selectedDate).add(1, 'day').valueOf()])
    // this.rangeArr = [this.selectedDate.getTime(), moment(this.selectedDate).add(1, 'day').valueOf()];
    this.currRange = [1, 200];
  }
}
