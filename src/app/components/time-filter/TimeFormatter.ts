/**
 * Created by talgvili on 23/07/2017.
 */
import {NouiFormatter} from 'ng2-nouislider';
export class TimeFormatter implements NouiFormatter {
  to(value: number): string {
    const h = Math.floor(value / 3600000);
    const m = Math.floor(value % 3600000 / 60000);
    const values = [h, m];
    let timeString = '';
    let i = 0;
    for (const v of values) {
      if (values[i] < 10) {
        timeString += '0';
      }

      timeString += values[i].toFixed(0);
      if (i < 1) {
        timeString += ':';
      }
      i++;
    }
    return timeString;
  }

  from(value: string): number {
    const v = value.split(':').map(parseInt);
    let time = 0;
    time += v[0] * 3600000;
    time += v[1] * 60000;
    return time;
  }
}
