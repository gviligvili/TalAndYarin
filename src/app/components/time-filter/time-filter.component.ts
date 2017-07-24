import {Component} from '@angular/core';
import {IMyDateModel, IMyDpOptions} from 'mydatepicker';
import * as moment from 'moment';
import {TimeFormatter} from './TimeFormatter';
import {TargetService} from '../../services/targets-service/target.service';


@Component({
  selector: 'time-filter',
  templateUrl: './time-filter.component.html',
  styleUrls: ['./time-filter.component.scss']
})
export class TimeFilterComponent {

  rangeConfig: any = {
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

  rangeArr: number[];
  currRange: number[];
  selectedDate: Date = moment().startOf('day').toDate();
  datePickerDate: any;
  isFilterByTimeOn: boolean;

  myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    showDecreaseDateBtn: true,
    showIncreaseDateBtn: true,
  };



  constructor(private targetsService: TargetService) {
    this.targetsService.getIsFilterByTimeOn$().subscribe((flag) => this.isFilterByTimeOn = flag);

    this.datePickerDate = {
      date: {
        year: this.selectedDate.getFullYear(),
        month: this.selectedDate.getMonth() + 1,
        day: this.selectedDate.getDate()
      }
    };


    this.resetSliderRange();
  }

  onDateChanged(event: IMyDateModel) {
    // Update value of selDate variable
    this.selectedDate = event.jsdate;
    this.resetSliderRange();
  }

  resetSliderRange() {
    this.currRange = [0, 86400000];
  }

  sliderChanged(dateArr) {
    const currDay = this.selectedDate.getTime();
    const startDate = currDay + dateArr[0];
    const endDate = currDay + dateArr[1];
    this.targetsService.setFilterDates(startDate, endDate);
  }

  toggleFilterByTime() {
    this.targetsService.toggleFilterByTime();
  }

  stopCheckboxPropogation(e) {
    e.stopPropagation();
  }
}
