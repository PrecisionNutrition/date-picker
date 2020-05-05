import Component from '@glimmer/component';

import formatDate from 'date-fns/format';

import safeParse from '@precision-nutrition/date-picker/-private/safe-parse';

export default class NativeDatePicker extends Component {
  transformValue(date) {
    if (date) {
      const parsed = safeParse(date);
      return formatDate(parsed, 'yyyy-MM-dd');
    } else {
      return null;
    }
  }

  publishChoice(action , { target: { value } }) {
    const date = safeParse(value);

    return action(date);
  }
}
