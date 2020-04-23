import Component from '@glimmer/component';

import moment from 'moment';

export default class NativeDatePicker extends Component {
  publishChoice(action , { target: { value } }) {
    const date = moment(value).toDate();

    return action(date);
  }
}
