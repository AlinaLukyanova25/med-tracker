import { Reception } from "./types.js"

export function saveToStorage(arr: Reception[]) {
    localStorage.setItem('receptions', JSON.stringify(arr))
    console.log(JSON.stringify(arr))
}

export function loadFromStorage(): Reception[] {
    const stored = localStorage.getItem('receptions')
    if (stored) {
        try {
            const parsed = JSON.parse(stored)
            if (!Array.isArray(parsed)) return [];

            return parsed.map((item: any) => ({
                ...item,
                dateStart: new Date(item.dateStart),
                dateEnd: new Date(item.dateEnd)
            }))
        } catch (e) {
            console.error('Ошибка загрузки', e)
            return []
        }
    }
    return []
}