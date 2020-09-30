import isDate from 'date-fns/isDate';
import parseDate from 'date-fns/parse';
import parseJSON from 'date-fns/parseJSON';

// e.g. a date from JSON
const RFC3339_REGEXP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

export default function safeParse(value) {
  if (!value || isDate(value)) {
    return value;
  } else if (value.match(RFC3339_REGEXP)) {
    return parseJSON(value);
  } else if (value.endsWith('UTC')) {
    const correctedValue = value.split(' ').slice(0, 2).join('T') + '.000Z';

    return parseJSON(correctedValue);
  } else {
    return parseDate(value, 'yyyy-MM-dd', new Date());
  }
}
