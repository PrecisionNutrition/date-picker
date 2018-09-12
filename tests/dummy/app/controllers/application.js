import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: [
    'isNativePickerDisplayed',
  ],

  minimum: computed(function() {
    return new Date(2010, 0, 1);
  }),

  maximum: computed(function() {
    return new Date(2017, 0, 1);
  }),

  actions: {
    onChange(newValue) {
      this.set('currentValue', newValue);
    },
  },
});
