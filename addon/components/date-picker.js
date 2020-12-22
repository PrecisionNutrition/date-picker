import Component from '@glimmer/component';

import { inject as service } from '@ember/service';

import addToDate from 'date-fns/add';
import formatDate from 'date-fns/format';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isSameMonth from 'date-fns/isSameMonth';
import setMonth from 'date-fns/setMonth';
import setYear from 'date-fns/setYear';
import startOfDay from 'date-fns/startOfDay';
import subFromDate from 'date-fns/sub';

import safeParse from '@precision-nutrition/date-picker/-private/safe-parse';

export default class DatePicker extends Component {
  @service datePicker;

  inputClass = 'Input u-sizeFull p1 mt1';

  selectableMonthOptions = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  get castValue() {
    return safeParse(this.args.value);
  }

  get max() {
    return safeParse(this.args.max);
  }

  get min() {
    return safeParse(this.args.min);
  }

  get center() {
    const {
      _center,
      castValue,
      max,
      args: { explicitCenter },
    } = this;

    if (_center) {
      return _center;
    }

    if (explicitCenter) {
      return explicitCenter || castValue;
    }

    if (max && isBefore(max, new Date())) {
      return max;
    }

    return null;
  }

  set center(newCenter) {
    this._center = newCenter;

    return newCenter;
  }

  get defaultMaximum() {
    const today = new Date();

    return startOfDay(addToDate(today, { years: 1 }));
  }

  get maximum() {
    return this.max || this.defaultMaximum;
  }

  set maximum(v) {
    return v;
  }

  get defaultMinimum() {
    const today = new Date();

    return startOfDay(subFromDate(today, { years: '100' }));
  }

  get minimum() {
    return this.min || this.defaultMinimum;
  }

  get minYear() {
    return this.minimum.getFullYear();
  }

  get maxYear() {
    return this.maximum.getFullYear();
  }

  get selectableYearOptions() {
    const { minYear, maxYear } = this;

    const selectableYears = [];

    for (let i = minYear; i <= maxYear; i++) {
      // values must be strings for equality to work correctly in the template
      selectableYears.push(String(i));
    }

    return selectableYears.reverse();
  }

  navigateCenter(unit, calendar, { target: { value } }) {
    const currentCenter = calendar.center;
    let newCenter;

    if (unit === 'month') {
      newCenter = setMonth(currentCenter, value);
    } else {
      newCenter = setYear(currentCenter, value);
    }

    calendar.actions.changeCenter(newCenter);
  }

  // Unwraps the object we get back
  publishChoice(action, { date }) {
    action(date);
  }

  formatDate(date, formatString) {
    return date && formatDate(date, formatString);
  }

  isSameMonthOrBefore(d1, d2) {
    return isBefore(d1, d2) || isSameMonth(d1, d2);
  }

  isSameMonthOrAfter(d1, d2) {
    return isAfter(d1, d2) || isSameMonth(d1, d2);
  }
}
