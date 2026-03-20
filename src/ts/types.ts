export function getElement<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id)
    if (!el) throw new Error(`Элемент #${id} не найден`)
    return el as T
}

export function querySelectorEl<T extends HTMLElement>(selector: string): T {
    const el = document.querySelector(selector)
    if (!el) throw new Error(`Элемент "${selector}" не найден`)
    return el as T
}

export interface Reception {
    readonly id: number;
    diseaseName: string;
    medicationName: string;
    time: string[];
    dosage: number;
    stock: number;
    dateStart: Date;
    dateEnd: Date;
    taken: boolean;
}