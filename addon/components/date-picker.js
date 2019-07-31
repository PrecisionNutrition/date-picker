import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import moment from 'moment';
import layout from '../templates/components/date-picker';

const selectableMonthOptions = [
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

export default Component.extend({
  layout,

  attributeBindings: [
    'data-test-selector',
  ],

  inputClass: 'Input u-sizeFull p1 mt1',

  selectableMonthOptions,

  init() {
    this._super(...arguments);

    let explicitCenter = this.get('explicitCenter');
    let value = this.get('value');

    if (!explicitCenter) {
      return;
    }

    if (explicitCenter && value) {
      this.set('center', value);
    } else {
      this.set('center', explicitCenter);
    }
  },

  datePicker: service(),

  isNativePickerDisplayed: readOnly('datePicker.isNativePickerDisplayed'),

  castedValue: computed('value', function() {
    let { value } = this;

    if (!value) {
      return null;
    }

    let { isNativePickerDisplayed } = this;
    let casted = moment(value, 'YYYY-MM-DD');

    // Native input wants YYYY-MM-DD, desktop fancy picker wants a date object
    return isNativePickerDisplayed ? casted.format('YYYY-MM-DD') : casted.toDate();
  }),

  center: computed('max', {
    get() {
      let { max } = this;

      if (!moment().isBefore(moment(max))) {
        return max;
      }
    },
    set(_, v) {
      return v;
    },
  }),

  maximum: computed('max', {
    get() {
      let defaultValue = moment().add(1, 'year').startOf('day').toDate();
      let val = this.max || defaultValue;

      return val;
    },
    set(_, v) {
      return v;
    },
  }),

  minimum: computed('min', function() {
    let defaultValue = moment().subtract(100, 'years').startOf('day').toDate();
    let val = this.min || defaultValue;

    return val;
  }),

  minYear: computed('minimum', function() {
    return this.minimum.getFullYear();
  }),

  maxYear: computed('maximum', function() {
    return this.maximum.getFullYear();
  }),

  selectableYearOptions: computed('minYear', 'maxYear', function() {
    let {
      minYear,
      maxYear,
    } = this;

    let selectableYears = [];

    for (let i = minYear; i <= maxYear; i++) {
      // values must be strings for equality to work correctly in the template
      selectableYears.push(String(i));
    }

    return selectableYears.reverse();
  }),

  actions: {
    // http://www.ember-power-calendar.com/cookbook/nav-select
    changeCenter(unit, calendar, { target: { value } }) {
      let newCenter = moment(calendar.center).clone()[unit](value);

      calendar.actions.changeCenter(newCenter);
    },

    setValueAndValidate(newDate) {
      // HTML5 input type="date" returns a "YYYY-MM-DD" string
      // and Ember is expecting a Date

      // pickadate doesn't know anything about time zones
      // https://github.com/amsul/pickadate.js/issues/875
      let date = moment(newDate).format('YYYY-MM-DD');

      // TODO Remove this once we're using fullscreen-card-renderer everywhere
      let onChange = this.get('on-change');

      if (onChange) {
        onChange(date);
      } else {
        let atMidnightUtc = moment(date)
          .startOf('day')
          .utcOffset(0)
          .toDate();

        this.set('value', atMidnightUtc);
      }
    }
  }
});
