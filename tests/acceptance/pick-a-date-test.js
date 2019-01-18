import { find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | pick a date', function(hooks) {
  setupApplicationTest(hooks);

  test('sanity check pick a date', async function(assert) {
    let expectedValue = '2015-01-02';

    await visit('/');

    await datepickerSelect(
      '[data-test-selector="date-picker-wrapper"]',
      expectedValue
    );

    let capturedValue = find('[data-test-selector="current-value"]').textContent;

    assert.equal(
      capturedValue,
      expectedValue,
      'value is inserted as expected'
    );
  });
});

// Manually recreate the following, I can't get it to import for some reason:
//
// https://github.com/cibernox/ember-power-datepicker/blob/0f94dd88482c03df5e009c3f568fecb4344e6e4a/test-support/helpers/ember-power-datepicker.js

import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers';
import { calendarSelect } from 'ember-power-calendar/test-support';
import { assert } from '@ember/debug';

async function datepickerSelect(selector, selected) {
  assert('`datepickerSelect` expect a Date or MomentJS object as second argument', selected);

  let $selector = find(selector);
  assert('`datepickerSelect` couln\'t find any element with selector: ' + selector, $selector);

  let $trigger;

  if ($selector.classList.contains('ember-power-datepicker-trigger')) {
    $trigger = $selector;
  } else {
    $trigger = find(`${selector} .ember-power-datepicker-trigger`);
    assert('`datepickerSelect` couln\'t find any datepicker within the selector ' + selector, $trigger);
    selector = `${selector} .ember-power-datepicker-trigger`;
  }

  await clickTrigger(selector);
  await calendarSelect('.ember-power-datepicker-content', selected);
}
