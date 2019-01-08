import Component from '@ember/component';
import { computed } from '@ember/object';
import config from 'ember-get-config';
import moment from 'moment';
import bowser from 'ember-bowser';
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

const isMobile = config.environment === 'test' ||
  bowser.mobile ||
  bowser.tablet &&
  (bowser.name === 'Internet Explorer' && parseInt(bowser.version) !== 11);

export default Component.extend({
  layout,

  attributeBindings: [
    'data-test-selector',
  ],

  inputClass: 'Input u-sizeFull p1 mt1',

  selectableMonthOptions,

  center: computed('max', function() {
    let max = this.get('max');

    if (!moment().isBefore(moment(max))) {
      return max;
    }
  }),

  maximum: computed('max', function() {
    let defaultValue = moment().add(1, 'year').startOf('day').toDate();
    let val = this.get('max') || defaultValue;

    return val;
  }),

  minimum: computed('min', function() {
    let defaultValue = moment().subtract(100, 'years').startOf('day').toDate();
    let val = this.get('min') || defaultValue;

    return val;
  }),

  minYear: computed('minimum', function() {
    let minimum = this.get('minimum');

    return minimum.getFullYear();
  }),

  maxYear: computed('maximum', function() {
    let maximum = this.get('maximum');

    return maximum.getFullYear();
  }),

  selectableYearOptions: computed('minYear', 'maxYear', function() {
    let {
      minYear,
      maxYear,
    } = this.getProperties('minYear', 'maxYear');

    let selectableYears = [];

    for (let i = minYear; i <= maxYear; i++) {
      // values must be strings for equality to work correctly in the template
      selectableYears.push(String(i));
    }

    return selectableYears.reverse();
  }),

  // This boolean is being used to determine whether we should use native (mobile) controls for date input.
  // IE11 with a touch screen (or Wacom tablet) sets bowser.tablet to true, which breaks our logic here.
  // Windows mobiles don't present as "Internet Explorer", so by using a stricter check we can avoid this issue.
  // https://github.com/ded/bowser/issues/89
  isMobile,

  actions: {
    // http://www.ember-power-calendar.com/cookbook/nav-select
    changeCenter(unit, calendar, { target: { value } }) {
      let newCenter = calendar.center.clone()[unit](value);

      calendar.actions.changeCenter(newCenter);
    },

    setValueAndValidate(newDate) {
      // HTML5 input type="date" returns a "YYYY-MM-DD" string
      // and Ember is expecting a Date

      // pickadate doesn't know anything about time zones
      // https://github.com/amsul/pickadate.js/issues/875
      let date = this.get('isMobile') ? new Date(newDate) : newDate;

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
