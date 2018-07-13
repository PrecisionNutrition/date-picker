import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

module('Integration | Component | date picker [DESKTOP]', function(hooks) {
  setupRenderingTest(hooks);

  test('sets value on input field', async function(assert) {
    let testDate = new Date();
    this.set('testDate', testDate);

    await render(hbs`{{date-picker
      value=testDate
      isMobile=false
    }}`);

    let elem = find('input');

    let dateString = moment(testDate).format('MMMM D, YYYY');

    assert.equal(
      elem.value,
      dateString,
      'sets value correctly on picker'
    );
  });

  test('sets placeholder on input field', async function(assert) {
    await render(hbs`{{date-picker
      placeholder='Type here'
      isMobile=false
    }}`);

    let elem = find('input');

    assert.equal(
      elem.getAttribute('placeholder'),
      'Type here',
      'sets placeholder correctly on picker'
    );
  });

  test('next month button works', async function(assert) {
    await render(hbs`{{date-picker
      isMobile=false
    }}`);

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
    await render(hbs`{{date-picker
      isMobile=false
    }}`);

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
    await render(hbs`{{date-picker
      isMobile=false
    }}`);

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
    await render(hbs`{{date-picker
      isMobile=false
    }}`);

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

    await render(hbs`{{date-picker
      maximum=maximum
      isMobile=false
    }}`);

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

    await render(hbs`{{date-picker
      max=maximum
      isMobile=false
    }}`);

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

  test('can disable the trigger field', async function(assert) {
    await render(hbs`{{date-picker
      max=maximum
      isMobile=false
      isDisabled=true
      }}`);

    let field = find('[data-test-selector="date-picker-trigger"]');

    assert.ok(field.disabled);
  });

  test('next month button is disabled when max is reached', async function(assert) {
    let maximum = new Date('2010-12-31');
    this.set('maximum', maximum);

    await render(hbs`{{date-picker
      max=maximum
      isMobile=false
      }}`);

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

    await render(hbs`{{date-picker
      center=center
      min=min
      isMobile=false
      }}`);

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
