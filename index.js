'use strict';

module.exports = {
  name: '@precision-nutrition/date-picker',

  contentFor(type, config) {
    // https://github.com/cibernox/ember-power-select/issues/145#issuecomment-170012836
    if (type === 'body-footer') {
      let emberPowerDatepicker = this.addons.filter(function(addon) {
        return addon.name === 'ember-power-datepicker';
      })[0];

      return emberPowerDatepicker.contentFor(type, config);
    } else {
      return '';
    }
  },
};
