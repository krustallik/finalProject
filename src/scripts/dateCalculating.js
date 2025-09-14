
import {
    startOfMonth,
    startOfWeek,
    addDays,
    eachDayOfInterval,
    isSameMonth
} from 'date-fns';

export function getCalendarDays(currentDate) {
    const monthStart = startOfMonth(currentDate);

    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });

    const calendarEnd = addDays(calendarStart, 41);

    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return allDays.map(date => ({
        date,
        current: isSameMonth(date, currentDate),
    }));
}
