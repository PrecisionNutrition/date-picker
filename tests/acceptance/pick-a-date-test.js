import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | pick a date');

test('sanity check pick a date', function(assert) {
  let expectedValue = new Date(2015, 0, 2);

  visit('/');

  andThen(function() {
    datepickerSelect(
      '[data-test-selector="date-picker-wrapper"]',
      expectedValue
    );
  });

  andThen(function() {
    let capturedValue = find('[data-test-selector="current-value"]').text();

    assert.equal(
      capturedValue,
      expectedValue,
      'value is inserted as expected'
    );
  });
});
