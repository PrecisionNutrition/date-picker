import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import { fillIn, find } from 'ember-native-dom-helpers';

moduleForComponent('date-picker', 'Integration | Component | date picker [MOBILE]', {
  integration: true,
});

test('sets min and max on input field', async function(assert) {
  let min = moment().subtract(5, 'years').toDate();
  let max = new Date();

  this.setProperties({
    min,
    max,
  });

  this.render(hbs`{{date-picker
    min=min
    max=max
    isMobile=true
  }}`);

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
  let testDate = new Date();
  let requestedDate = '2016-10-01';

  this.set('testDate', testDate);

  this.render(hbs`{{date-picker
    value=testDate
    isMobile=true
  }}`);

  let currentValue = find('input').value;

  assert.equal(
    currentValue,
    moment(testDate).format('YYYY-MM-DD'),
    'hydrates the value correctly'
  );

  let elem = find('input');

  await fillIn(elem, requestedDate);

  let expectedDateValue = moment(requestedDate, 'YYYY-MM-DD')
    .startOf('day')
    .utcOffset(0)
    .toDate();

  assert.equal(
    elem.value,
    requestedDate,
    'sets date correctly on mobile picker input field'
  );

  assert.deepEqual(
    this.get('testDate'),
    expectedDateValue,
    'sets value correctly'
  );
});

test('sets placeholder on input field', async function(assert) {
  this.render(hbs`{{date-picker
    placeholder='Type here'
    isMobile=true
  }}`);

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

  let expectedDateValue = moment(requestedDate, 'YYYY-MM-DD').startOf('day').utcOffset(0).toDate();

  this.set('testDate', testDate);

  this.set('onChange', (value) => {
    assert.deepEqual(
      value,
      expectedDateValue,
      'passes new value to handler'
    );
  });

  this.render(hbs`{{date-picker
    value=testDate
    isMobile=true
    on-change=(action onChange)
  }}`);

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
test('can disable the input', function(assert) {
  this.render(hbs`{{date-picker
    max=maximum
    isDisabled=true
    isMobile=true
    }}`);

  let field = find('[data-test-selector="input-field"]');

  assert.ok(field.disabled);
});
