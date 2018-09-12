import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  datePicker: service(),

  actions: {
    toggleNative() {
      let currentValue = this.get('datePicker.isNativePickerDisplayed');

      this.set('datePicker.isNativePickerDisplayed', !currentValue);
    },
  },
});
