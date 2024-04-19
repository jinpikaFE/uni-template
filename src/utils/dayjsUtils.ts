import dayjs, { type Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import duration from 'dayjs/plugin/duration';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekOfYear);
dayjs.extend(duration);

export { Dayjs, dayjs };

