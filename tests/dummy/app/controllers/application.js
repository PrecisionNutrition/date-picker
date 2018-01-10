import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: [
    'isMobile',
  ],

  isMobile: false,

  minimum: computed(function() {
    return new Date(2015, 0, 1);
  }),

  maximum: computed(function() {
    return new Date(2016, 0, 1);
  }),

  actions: {
    onChange(newValue) {
      this.set('currentValue', newValue);
    },
  },
});
