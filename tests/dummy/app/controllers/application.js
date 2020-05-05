import Controller from '@ember/controller';

import { action } from '@ember/object';

import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service datePicker;

  currentValue = null;

  minimum = new Date(2010, 0, 1);

  maximum = new Date(2017, 0, 1);

  @action
  onChange(newValue) {
    this.set('currentValue', newValue);
  }

  @action
  toggleNative() {
    this.datePicker.toggleProperty('isNativePickerDisplayed');
  }
}
