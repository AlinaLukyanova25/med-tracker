import { Reception } from "../types/types.js"

export function getTimeReception(time: string[]): Date[]{
    const date = new Date()
    // if (time.length === 1) {
    //     return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(time[0].slice(0, 2)), Number(time[0].slice(3)))
    // } else {
    //     const newTime = time.map(t => {
    //         return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(t.slice(0, 2)), Number(t.slice(3)))
    //     })
    //     return newTime
    // }
    return time.map(t => new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        Number(t.slice(0, 2)),
        Number(t.slice(3))
    ))
}

export function shouldUpdateTaken(reception: Reception): boolean {
    const lastUpdate = new Date(reception.lastTakenUpdate);
    const today = new Date();
        
    return (
        lastUpdate.getFullYear() !== today.getFullYear() ||
        lastUpdate.getMonth() !== today.getMonth() ||
        lastUpdate.getDate() !== today.getDate()
    );
}

export function isDatePassed(date1: Date, date2: Date): boolean {
    const d1 = new Date(date1)
    const d2 = new Date(date2)

    d1.setHours(0, 0, 0, 0)
    d2.setHours(0, 0, 0, 0)

    console.log(d1, d2)
    return d2 > d1
}

export function formatDateRu(date: Date): string {
    return date.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' });
} 