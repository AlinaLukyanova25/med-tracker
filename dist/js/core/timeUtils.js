export const DateUtils = {
    getTodayDate() {
        return new Date();
    },
    getTomorrowDate() {
        const today = this.getTodayDate();
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + 1);
        return nextDay;
    },
    getTomorrowDateString() {
        const nextDay = this.getTomorrowDate();
        const year = nextDay.getFullYear();
        const month = String(nextDay.getMonth() + 1).padStart(2, '0');
        const day = String(nextDay.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    setMinDate(element) {
        if (!element) {
            console.warn('Элемент не найден');
            return;
        }
        element.setAttribute('min', this.getTomorrowDateString());
    },
};
export function getTimeReception(time, date = new Date()) {
    return time.map(t => new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(t.slice(0, 2)), Number(t.slice(3))));
}
export function shouldUpdateTaken(reception) {
    const lastUpdate = new Date(reception.lastTakenUpdate);
    const today = new Date();
    return (lastUpdate.getFullYear() !== today.getFullYear() ||
        lastUpdate.getMonth() !== today.getMonth() ||
        lastUpdate.getDate() !== today.getDate());
}
export function isDatePassed(date1) {
    const d1 = new Date(date1);
    const d2 = new Date();
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return d2 > d1;
}
export function formatDateRu(date) {
    return date.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' });
}
export function checkRecedptionTime(reception) {
    const times = getTimeReception(reception.time);
    const nextTime = times[0];
    const now = new Date();
    return (nextTime.getTime() - now.getTime()) < 900000;
}
