import { find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { datepickerSelect } from 'ember-power-datepicker/test-support';

module('Acceptance | pick a date', function(hooks) {
  setupApplicationTest(hooks);

  test('sanity check pick a date', async function(assert) {
    let inputValue = new Date(2015, 0, 2);
    let expectedValue = '2015-01-02';

    await visit('/');

    await datepickerSelect(
      '[data-test-selector="date-picker-wrapper"]',
      inputValue
    );

    let capturedValue = find('[data-test-selector="current-value"]').textContent;

    assert.equal(
      capturedValue,
      expectedValue,
      'value is inserted as expected'
    );
  });
});
