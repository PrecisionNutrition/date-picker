import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import safeParse from '@precision-nutrition/date-picker/-private/safe-parse';

import formatDate from 'date-fns/format';
import startOfDay from 'date-fns/startOfDay';
import subDate from 'date-fns/sub';

module('Integration | Component | date picker', function (hooks) {
  setupRenderingTest(hooks);

  module('non-native component', function (hooks) {
    hooks.beforeEach(function () {
      const dps = this.owner.lookup('service:date-picker');

      dps.set('isNativePickerDisplayed', false);
    });

    test('custom classes are applied', async function (assert) {
      await render(hbs`<DatePicker @inputClass="fart-fart-class" />`);

      await click('[data-test-selector="date-picker-trigger"]');

      assert.dom('[data-test-selector="date-picker-content"]').hasClass('DatePicker');

      assert.dom('[data-test-selector="date-picker-trigger"]').hasClass('fart-fart-class');
    });

    test('sets value on input field', async function (assert) {
      const testDate = '2020-05-22';

      this.set('testDate', testDate);

      this.onChange = (newDate) => {
        this.set('testDate', newDate);
      };

      await render(hbs`
        <DatePicker
          @value={{this.testDate}}
          @onChange={{this.onChange}}
        />
      `);

      assert
        .dom('input')
        .hasValue(
          formatDate(new Date(2020, 4, 22), 'MMMM d, yyyy'),
          'sets value correctly on picker'
        );
    });

    test('value is serialized with JSON', async function (assert) {
      const testDate = new Date(2020, 4, 22).toJSON();

      this.testDate = testDate;

      await render(hbs`
        <DatePicker
          @value={{this.testDate}}
        />
      `);

      assert
        .dom('input')
        .hasValue(
          formatDate(new Date(2020, 4, 22), 'MMMM d, yyyy'),
          'sets value correctly on picker'
        );
    });

    test('supports date object value', async function (assert) {
      let testDate = new Date();

      this.set('testDate', testDate);

      await render(hbs`<DatePicker @value={{this.testDate}} />`);

      let dateString = formatDate(testDate, 'MMMM d, yyyy');

      assert.dom('input').hasValue(dateString, 'sets value correctly on picker');
    });

    test('yet another date format', async function (assert) {
      const testDate = '1940-07-07 23:23:23 UTC';

      this.set('testDate', testDate);

      await render(hbs`<DatePicker @value={{this.testDate}} />`);

      let dateString = formatDate(new Date(1940, 6, 7, 23, 23, 23), 'MMMM d, yyyy');

      assert.dom('input').hasValue(dateString, 'sets value correctly on picker');
    });

    test('sets placeholder on input field', async function (assert) {
      await render(hbs`<DatePicker @placeholder="Type here" />`);

      assert
        .dom('input')
        .hasAttribute('placeholder', 'Type here', 'sets placeholder correctly on picker');
    });

    test('next month button works', async function (assert) {
      const testDate = new Date(2020, 4, 22);
      this.set('testDate', testDate.toJSON());

      await render(hbs`<DatePicker @value={{this.testDate}} />`);

      await click('[data-test-selector="date-picker-trigger"]');
      await click('[data-test-selector="next-month-button"]');

      const calendarNav = find('[data-test-selector="calendar-nav"]');

      const centerVal = calendarNav.getAttribute('data-test-center-value');

      const centerDate = safeParse(centerVal);

      assert.equal(
        centerDate.getMonth(),
        testDate.getMonth() + 1,
        'center has been advanced by one month'
      );
    });

    test('previous month button works', async function (assert) {
      await render(hbs`<DatePicker />`);

      await click('[data-test-selector="date-picker-trigger"]');

      await click('[data-test-selector="previous-month-button"]');

      let calendarNav = find('[data-test-selector="calendar-nav"]');

      let centerVal = calendarNav.getAttribute('data-test-center-value');

      let centerDate = safeParse(centerVal);

      assert.equal(
        centerDate.getMonth(),
        new Date().getMonth() - 1,
        'center has been advanced by one month'
      );
    });

    test('month drop down works', async function (assert) {
      await render(hbs`<DatePicker />`);

      await click('[data-test-selector="date-picker-trigger"]');

      let monthSelector = find('[data-test-selector="month-selector"]');

      let calendarNav = find('[data-test-selector="calendar-nav"]');

      await fillIn(monthSelector, '3');

      assert.dom('[data-test-selector="month-selector"]').hasValue('3');

      assert
        .dom('[data-test-selector="month-selector"] option[value="3"]:checked')
        .hasText('April', 'month should be selected');

      let centerDateString = calendarNav.getAttribute('data-test-center-value');
      let centerDate = safeParse(centerDateString);

      assert.equal(centerDate.getMonth(), 3, 'correct month should be selected');

      await fillIn(monthSelector, 'January');

      centerDateString = calendarNav.getAttribute('data-test-center-value');
      centerDate = safeParse(centerDateString);

      assert.equal(centerDate.getMonth(), 0, 'correct month should be selected');
    });

    test('year drop down works', async function (assert) {
      await render(hbs`<DatePicker />`);

      await click('[data-test-selector="date-picker-trigger"]');

      let yearSelector = '[data-test-selector="year-selector"]';

      let calendarNav = find('[data-test-selector="calendar-nav"]');

      await fillIn(yearSelector, '2013');

      assert.dom(yearSelector).hasValue('2013', 'year should be selected');

      let centerDateString = calendarNav.getAttribute('data-test-center-value');
      let centerDate = safeParse(centerDateString);

      assert.equal(centerDate.getFullYear(), 2013, 'correct year should be set');

      await fillIn(yearSelector, 2018);

      centerDateString = calendarNav.getAttribute('data-test-center-value');
      centerDate = safeParse(centerDateString);

      assert.equal(centerDate.getFullYear(), 2018, 'correct year should be set');
    });

    test('correctly initializes center value', async function (assert) {
      let maximum = new Date(2030, 0, 0);
      this.set('maximum', maximum);

      await render(hbs`<DatePicker @maximum={{this.maximum}} />`);

      await click('[data-test-selector="date-picker-trigger"]');

      let calendarNav = find('[data-test-selector="calendar-nav"]');
      let centerDateString = calendarNav.getAttribute('data-test-center-value');
      let centerDate = safeParse(centerDateString);

      assert.equal(
        centerDate.getFullYear(),
        new Date().getFullYear(),
        'correct year should be set'
      );
    });

    test('initializes center value to maximum if max is in the past', async function (assert) {
      let maximum = new Date(2010, 11, 30);
      this.set('maximum', maximum);

      await render(hbs`<DatePicker @max={{this.maximum}} />`);

      await click('[data-test-selector="date-picker-trigger"]');

      let calendarNav = find('[data-test-selector="calendar-nav"]');
      let centerDateString = calendarNav.getAttribute('data-test-center-value');
      let centerDate = safeParse(centerDateString);

      assert.equal(centerDate.getFullYear(), 2010, 'correct year should be set');
    });

    test('correctly initializes center value when explicitly set', async function (assert) {
      let dateInThePast = '1979-06-01';
      let explicitCenter = safeParse(dateInThePast);
      this.set('explicitCenter', explicitCenter);

      await render(hbs`<DatePicker @explicitCenter={{this.explicitCenter}} />`);

      await click('[data-test-selector="date-picker-trigger"]');

      let calendarNav = find('[data-test-selector="calendar-nav"]');
      let centerDateString = calendarNav.getAttribute('data-test-center-value');
      let centerDate = safeParse(centerDateString);

      assert.equal(centerDate.getFullYear(), 1979, 'correct year should be set');
    });

    test('can disable the trigger field', async function (assert) {
      await render(hbs`<DatePicker
        @max={{this.maximum}}
        @isDisabled={{true}}
      />`);

      assert.dom('[data-test-selector="date-picker-trigger"]').isDisabled();
    });

    test('next month button is disabled when max is reached', async function (assert) {
      const nextButtonSelector = '[data-test-selector="next-month-button"]';

      let max = new Date(2010, 11, 31);
      let center = new Date(2010, 10, 30);

      this.setProperties({
        max,
        center,
      });

      await render(hbs`<DatePicker
        @explicitCenter={{this.center}}
        @max={{this.max}}
      />`);

      await click('[data-test-selector="date-picker-trigger"]');

      assert.dom(nextButtonSelector).isNotDisabled();

      await click(nextButtonSelector);

      assert.dom(nextButtonSelector).isDisabled();
    });

    test('previous month button is disabled when min is reached', async function (assert) {
      const prevButtonSelector = '[data-test-selector="previous-month-button"]';

      let min = new Date(2010, 0, 0);
      let center = new Date(2010, 1, 0);

      this.setProperties({
        min,
        center,
      });

      await render(hbs`<DatePicker
        @explicitCenter={{this.center}}
        @min={{this.min}}
      />`);

      await click('[data-test-selector="date-picker-trigger"]');

      assert.dom(prevButtonSelector).isNotDisabled();

      await click(prevButtonSelector);

      assert.dom(prevButtonSelector).isDisabled();
    });
  });

  module('native date picker', function (hooks) {
    hooks.beforeEach(function () {
      const dps = this.owner.lookup('service:date-picker');

      dps.set('isNativePickerDisplayed', true);
    });

    test('sets min and max on input field', async function (assert) {
      let min = subDate(new Date(), { years: 5 });
      let max = new Date();

      this.setProperties({
        min,
        max,
      });

      await render(hbs`
        <DatePicker
          @min={{this.min}}
          @max={{this.max}}
        />
      `);

      assert
        .dom('input')
        .hasAttribute('min', /^\d{4}-\d{2}-\d{2}$/, 'sets minimum correctly on picker')
        .hasAttribute('max', /^\d{4}-\d{2}-\d{2}$/, 'sets maximum correctly on picker');
    });

    test('sets value on input field', async function (assert) {
      let initialDate = '2016-10-01';
      let newDate = '2018-01-18';

      this.set('testDate', initialDate);

      this.set('onChange', (newValue) => this.set('testDate', newValue));

      await render(hbs`
        <DatePicker
          @value={{this.testDate}}
          @onChange={{this.onChange}}
        />
      `);

      assert.dom('input').hasValue(initialDate, 'hydrates the value correctly');

      await fillIn('input', newDate);

      let expectedDateValue = startOfDay(safeParse(newDate));

      assert.dom('input').hasValue(newDate, 'sets date correctly on mobile picker input field');

      assert.deepEqual(this.testDate, expectedDateValue, 'sets value correctly');
    });

    test('supports date object value', async function (assert) {
      let testDate = new Date();

      this.set('testDate', testDate);

      await render(hbs`
        <DatePicker
          @value={{this.testDate}}
        />
      `);

      assert
        .dom('input')
        .hasValue(formatDate(testDate, 'yyyy-MM-dd'), 'hydrates the value correctly');
    });

    test('sets placeholder on input field', async function (assert) {
      await render(hbs`<DatePicker @placeholder="Type here" />`);

      assert
        .dom('input')
        .hasAttribute('placeholder', 'Type here', 'sets placeholder correctly on picker');
    });

    test('setting a value when a handler has been set', async function (assert) {
      assert.expect(3);

      let testDate = new Date();
      let requestedDate = '2016-10-01';

      this.set('testDate', testDate);

      this.set('onChange', (value) => {
        assert.deepEqual(value, new Date(2016, 9, 1), 'passes new value to handler');

        this.set('testDate', value);
      });

      await render(hbs`
        <DatePicker
          @value={{this.testDate}}
          @onChange={{this.onChange}}
        />
      `);

      assert
        .dom('input')
        .hasValue(formatDate(testDate, 'yyyy-MM-dd'), 'hydrates the value correctly');

      await fillIn('input', requestedDate);

      assert
        .dom('input')
        .hasValue(requestedDate, 'sets date correctly on mobile picker input field');
    });

    test('can disable the input', async function (assert) {
      await render(hbs`
        <DatePicker
          @max={{this.maximum}}
          @isDisabled={{true}}
        />
      `);

      assert.dom('[data-test-selector="input-field"]').isDisabled();
    });

    test('can apply class to input', async function (assert) {
      await render(hbs`<DatePicker @inputClass="fart-fart-class" />`);

      assert.dom('[data-test-selector="input-field"]').hasClass('fart-fart-class');
    });
  });
});
