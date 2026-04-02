import { Disease } from "../types/common"

export function saveToStorage(arr: Disease[]) {
    localStorage.setItem('diseases', JSON.stringify(arr))
    console.log(JSON.stringify(arr))
}

export function loadFromStorage(): Disease[] {
    const stored = localStorage.getItem('diseases')
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