import isDate from 'date-fns/isDate';
import parseDate from 'date-fns/parse';

export default function safeParse(value) {
  if (isDate(value)) {
    return value;
  } else {
    return value && parseDate(value, 'yyyy-MM-dd', new Date());
  }
}
