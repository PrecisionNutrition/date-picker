import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

module('Integration | Component | date picker', function(hooks) {
  setupRenderingTest(hooks);

  module('non-native component', function(hooks) {
    hooks.beforeEach(function() {
      const dps = this.owner.lookup('service:date-picker');

      dps.set('isNativePickerDisplayed', false);
    });

    test('custom classes are applied', async function(assert) {
      await render(hbs`<DatePicker />`);

      await click('[data-test-selector="date-picker-trigger"]');

      assert
        .dom('[data-test-selector="date-picker-content"]')
        .hasClass('DatePicker');
    });

    test('sets value on input field', async function(assert) {
      let testDate = moment().format('YYYY-MM-DD');

      this.set('testDate', testDate);

      await render(hbs`<DatePicker
        @value={{testDate}}
      />`);

      let elem = find('input');

      let dateString = moment(testDate).format('MMMM D, YYYY');

      assert.equal(
        elem.value,
        dateString,
        'sets value correctly on picker'
      );
    });

    test('supports legacy date object value', async function(assert) {
      let testDate = new Date();

      this.set('testDate', testDate);

      await render(hbs`<DatePicker
        @value={{testDate}}
      />`);

      let elem = find('input');

      let dateString = moment(testDate).format('MMMM D, YYYY');

      assert.equal(
        elem.value,
        dateString,
        'sets value correctly on picker'
      );
    });

    test('supports legacy localstorage value', async function(assert) {
      let testDate = new Date();
      let testDateInIsoFormat = testDate.toISOString();

      this.set('testDate', testDateInIsoFormat);

      await render(hbs`<DatePicker
        @value={{testDate}}
      />`);

      let elem = find('input');

      let dateString = moment(testDate).format('MMMM D, YYYY');

      assert.equal(
        elem.value,
        dateString,
        'sets value correctly on picker'
      );
    });

    test('sets placeholder on input field', async function(assert) {
      await render(hbs`<DatePicker
        @placeholder="Type here"
      />`);

      let elem = find('input');

      assert.equal(
        elem.getAttribute('placeholder'),
        'Type here',
        'sets placeholder correctly on picker'
      );
    });

    test('next month button works', async function(assert) {
      await render(hbs`<DatePicker />`);

      await click('[data-test-selector="date-picker-trigger"]');

      await click('[data-test-selector="next-month-button"]');

      let calendarNav = await find('[data-test-selector="calendar-nav"]');

      let centerVal = calendarNav.getAttribute('data-test-center-value');

      let centerDate = moment(Date.parse(centerVal));

      let currentDate = moment();

      let diff = Math.round(centerDate.diff(currentDate, 'month', true));

      assert.equal(
        diff,
        1,
        'center has been advanced by one month'
      );
    });

    test('previous month button works', async function(assert) {
      await render(hbs`<DatePicker />`);

      await click('[data-test-selector="date-picker-trigger"]');

      await click('[data-test-selector="previous-month-button"]');

      let calendarNav = await find('[data-test-selector="calendar-nav"]');

      let centerVal = calendarNav.getAttribute('data-test-center-value');

      let centerDate = moment(Date.parse(centerVal));

      let currentDate = moment();

      let diff = Math.round(centerDate.diff(currentDate, 'month', true));

      assert.equal(
        diff,
        -1,
        'center has been advanced by one month'
      );
    });

    test('month drop down works', async function(assert) {
      await render(hbs`<DatePicker />`);

      await click('[data-test-selector="date-picker-trigger"]');

      let monthSelector = find('[data-test-selector="month-selector"]');

      let calendarNav = find('[data-test-selector="calendar-nav"]');

      await fillIn(monthSelector, 'April');

      assert.equal(
        monthSelector.value,
        'April',
        'month should be selected'
      );

      let centerDateString = calendarNav.getAttribute('data-test-center-value');
      let centerDate = moment(centerDateString);

      assert.equal(
        centerDate.get('month'),
        3,
        'correct month should be selected'
      );

      await fillIn(monthSelector, 'January');

      centerDateString = calendarNav.getAttribute('data-test-center-value');
      centerDate = moment(centerDateString);

      assert.equal(
        centerDate.get('month'),
        0,
        'correct month should be selected'
      );
    });

    test('year drop down works', async function(assert) {
      await render(hbs`<DatePicker />`);

      await click('[data-test-selector="date-picker-trigger"]');

      let yearSelector = find('[data-test-selector="year-selector"]');

      let calendarNav = find('[data-test-selector="calendar-nav"]');

      await fillIn(yearSelector, '2013');

      assert.equal(
        yearSelector.value,
        2013,
        'year should be selected'
      );

      let centerDateString = calendarNav.getAttribute('data-test-center-value');
      let centerDate = moment(centerDateString);

      assert.equal(
        centerDate.get('year'),
        2013,
        'correct year should be set'
      );

      await fillIn(yearSelector, 2018);

      centerDateString = calendarNav.getAttribute('data-test-center-value');
      centerDate = moment(centerDateString);

      assert.equal(
        centerDate.get('year'),
        2018,
        'correct year should be set'
      );
    });

    test('correctly initializes center value', async function(assert) {
      let maximum = new Date('2030-01-01');
      this.set('maximum', maximum);

      await render(hbs`<DatePicker
        @maximum={{maximum}}
      />`);

      await click('[data-test-selector="date-picker-trigger"]');

      let calendarNav = find('[data-test-selector="calendar-nav"]');
      let centerDateString = calendarNav.getAttribute('data-test-center-value');
      let centerDate = moment(centerDateString);

      assert.equal(
        centerDate.get('year'),
        moment().year(),
        'correct year should be set'
      );
    });

    test('initializes center value to maximum if max is in the past', async function(assert) {
      let maximum = new Date('2010-12-31');
      this.set('maximum', maximum);

      await render(hbs`<DatePicker
        @max={{maximum}}
      />`);

      await click('[data-test-selector="date-picker-trigger"]');

      let calendarNav = find('[data-test-selector="calendar-nav"]');
      let centerDateString = calendarNav.getAttribute('data-test-center-value');
      let centerDate = moment(centerDateString);

      assert.equal(
        centerDate.get('year'),
        2010,
        'correct year should be set'
      );
    });

    test('correctly initializes center value when explicitly set', async function(assert) {
      let dateInThePast = '1979-06-01';
      let explicitCenter = new Date(dateInThePast);
      this.set('explicitCenter', explicitCenter);

      await render(hbs`<DatePicker
        @explicitCenter={{explicitCenter}}
      />`);

      await click('[data-test-selector="date-picker-trigger"]');

      let calendarNav = find('[data-test-selector="calendar-nav"]');
      let centerDateString = calendarNav.getAttribute('data-test-center-value');
      let centerDate = moment(centerDateString);

      assert.equal(
        centerDate.get('year'),
        1979,
        'correct year should be set'
      );
    });

    test('can disable the trigger field', async function(assert) {
      await render(hbs`<DatePicker
        @max={{maximum}}
        @isDisabled={{true}}
      />`);

      let field = find('[data-test-selector="date-picker-trigger"]');

      assert.ok(field.disabled);
    });

    test('next month button is disabled when max is reached', async function(assert) {
      let maximum = new Date('2010-12-31');
      this.set('maximum', maximum);

      await render(hbs`<DatePicker
        @max={{maximum}}
      />`);

      await click('[data-test-selector="date-picker-trigger"]');

      let nextButton = find('[data-test-selector="next-month-button"]');

      assert.ok(
        nextButton.disabled,
        'next button is disabled'
      );

      await click('[data-test-selector="previous-month-button"]');

      nextButton = find('[data-test-selector="next-month-button"]');

      assert.notOk(
        nextButton.disabled,
        'next button is shown'
      );
    });

    test('previous month button is disabled when min is reached', async function(assert) {
      let minimum = new Date('2010-01-01');
      this.set('min', minimum);
      let center = new Date('2010-02-01');
      this.set('center', center);

      await render(hbs`<DatePicker
        @center={{center}}
        @min={{min}}
      />`);

      await click('[data-test-selector="date-picker-trigger"]');

      let prevButton = find('[data-test-selector="previous-month-button"]');

      assert.notOk(
        prevButton.disabled,
        'prev button is enabled'
      );

      await click('[data-test-selector="previous-month-button"]');

      assert.ok(
        prevButton.disabled,
        'prev button is disabled'
      );
    });
  });

  module('native date picker', function(hooks) {
    hooks.beforeEach(function() {
      const dps = this.owner.lookup('service:date-picker');

      dps.set('isNativePickerDisplayed', true);
    });

    test('sets min and max on input field', async function(assert) {
      let min = moment().subtract(5, 'years').toDate();
      let max = new Date();

      this.setProperties({
        min,
        max,
      });

      await render(hbs`<DatePicker
        @min={{min}}
        @max={{max}}
      />`);

      let elem = find('input');

      assert.ok(
        /^\d{4}-\d{2}-\d{2}$/.test(elem.getAttribute('min')),
        'sets minimum correctly on picker'
      );

      assert.ok(
        /^\d{4}-\d{2}-\d{2}$/.test(elem.getAttribute('max')),
        'sets maximum correctly on picker'
      );
    });

    test('sets value on input field', async function(assert) {
      let initialDate = '2016-10-01';
      let newDate = '2018-01-18';

      this.set('testDate', initialDate);

      await render(hbs`<DatePicker
        @value={{testDate}}
      />`);

      let currentValue = find('input').value;

      assert.equal(
        currentValue,
        moment(initialDate).format('YYYY-MM-DD'),
        'hydrates the value correctly'
      );

      let elem = find('input');

      await fillIn(elem, newDate);

      let expectedDateValue = moment(newDate, 'YYYY-MM-DD')
        .startOf('day')
        .utcOffset(0)
        .toDate();

      assert.equal(
        elem.value,
        newDate,
        'sets date correctly on mobile picker input field'
      );

      assert.deepEqual(
        this.get('testDate'),
        expectedDateValue,
        'sets value correctly'
      );
    });

    test('supports legacy date object value', async function(assert) {
      let testDate = new Date();

      this.set('testDate', testDate);

      await render(hbs`<DatePicker
        @value={{testDate}}
      />`);

      let currentValue = find('input').value;

      assert.equal(
        currentValue,
        moment(testDate).format('YYYY-MM-DD'),
        'hydrates the value correctly'
      );
    });

    test('supports legacy localstorage value', async function(assert) {
      let testDate = new Date();
      let testDateInIsoFormat = testDate.toISOString();

      this.set('testDate', testDateInIsoFormat);

      await render(hbs`<DatePicker
        @value={{testDate}}
      />`);

      let currentValue = find('input').value;

      assert.equal(
        currentValue,
        moment(testDate).format('YYYY-MM-DD'),
        'hydrates the value correctly'
      );
    });

    test('sets placeholder on input field', async function(assert) {
      await render(hbs`<DatePicker
        @placeholder="Type here"
      />`);

      let elem = find('input');

      assert.equal(
        elem.getAttribute('placeholder'),
        'Type here',
        'sets placeholder correctly on picker'
      );
    });

    test('setting a value when a handler has been set', async function(assert) {
      assert.expect(3);

      let testDate = new Date();
      let requestedDate = '2016-10-01';

      this.set('testDate', testDate);

      this.set('onChange', (value) => {
        assert.deepEqual(
          value,
          requestedDate,
          'passes new value to handler'
        );
      });

      await render(hbs`<DatePicker
        @value={{testDate}}
        @on-change={{action onChange}}
      />`);

      let elem = find('input');

      let currentValue = elem.value;

      assert.equal(
        currentValue,
        moment(testDate).format('YYYY-MM-DD'),
        'hydrates the value correctly'
      );

      await fillIn(elem, requestedDate);

      assert.equal(
        elem.value,
        requestedDate,
        'sets date correctly on mobile picker input field'
      );
    });

    test('can disable the input', async function(assert) {
      await render(hbs`<DatePicker
        @max={{maximum}}
        @isDisabled={{true}}
      />`);

      let field = find('[data-test-selector="input-field"]');

      assert.ok(field.disabled);
    });
  });
});
