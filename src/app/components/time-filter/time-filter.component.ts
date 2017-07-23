import {Component, OnInit} from '@angular/core';
import {IMyDateModel, IMyDpOptions} from "mydatepicker";
import * as moment from "moment";


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
    pips: {
      mode: 'steps',
      density: 5
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
    this.rangeArr = [this.selectedDate.getTime(), moment(this.selectedDate).add(1, 'day').valueOf()];
    this.currRange = [this.selectedDate.getTime(), moment(this.selectedDate).add(1, 'day').valueOf()];

    // I'm doing it because of some stupid race condition.
    let self = this;
    setTimeout(() => {
      self.currRange = [self.selectedDate.getTime(), moment(self.selectedDate).add(1, 'day').valueOf()];
    }, 200);
  }
}
