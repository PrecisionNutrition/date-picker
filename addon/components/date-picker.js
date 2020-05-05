import Component from '@glimmer/component';

import { inject as service } from '@ember/service';

import moment from 'moment';

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
    const {
      args: {
        value,
      },
    } = this;

    return value && moment(value);
  }

  get center() {
    const {
      _center,
      castValue,
      args: {
        explicitCenter,
        max,
      },
    } = this;

    if (_center) {
      return _center;
    }

    if (explicitCenter) {
      return explicitCenter || castValue;
    }

    if (max && !moment().isBefore(moment(max))) {
      return max;
    }

    return null;
  }

  set center(newCenter) {
    this._center = newCenter;

    return newCenter;
  }

  get maximum() {
    const defaultValue = moment().add(1, 'year').startOf('day').toDate();
    const val = this.args.max || defaultValue;

    return val;
  }

  set maximum(v) {
    return v;
  }

  get minimum() {
    const defaultValue = moment().subtract(100, 'years').startOf('day').toDate();
    const val = this.args.min || defaultValue;

    return val;
  }

  get minYear() {
    return this.minimum.getFullYear();
  }

  get maxYear() {
    return this.maximum.getFullYear();
  }

  get selectableYearOptions() {
    const {
      minYear,
      maxYear,
    } = this;

    const selectableYears = [];

    for (let i = minYear; i <= maxYear; i++) {
      // values must be strings for equality to work correctly in the template
      selectableYears.push(String(i));
    }

    return selectableYears.reverse();
  }

  navigateCenter(unit, calendar, { target: { value } }) {
    const newCenter = moment(calendar.center).clone()[unit](value);

    calendar.actions.changeCenter(newCenter);
  }

  // Unwraps the object we get back
  publishChoice(action, { date }) {
    action(date);
  }
}
