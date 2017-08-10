import Ember from 'ember';

const {
  Controller,
} = Ember;

export default Controller.extend({
  minimum: new Date(2015, 0, 1),

  maximum: new Date(2016, 0, 1),

  currentValue: null,

  actions: {
    onChange(newValue) {
      this.set('currentValue', newValue);
    },
  },
});
