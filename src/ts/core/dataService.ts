import { loadFromStorage, saveToStorage } from "./storage.js";
import { isDatePassed, shouldUpdateTaken } from "./timeUtils.js";
import { Reception } from "../types/types.js";

export class DataService {
    private receptions: Reception[] = [];
    private listeners: (() => void)[] = [];

    constructor() {
        this.load()
    }

    getReceptions(): Reception[] {
        return this.receptions
    }

    subscribe(callback: () => void) {
        this.listeners.push(callback)
    }

    private notify() {
        this.listeners.forEach(cb => cb());
        console.log(`Хранение ${this.listeners}`)
    }

    addReception(reception: Reception): void {
        this.receptions.push(reception)
        this.saveLocalStorage()
    }

    findReception(id: number): Reception | undefined {
        return this.receptions.find(r => r.id === id)
    }

    updateReception(id: number, updater: (rec: Reception) => void) {
        const rec = this.receptions.find(r => r.id === id)
        if (rec) {
            updater(rec)
            this.saveLocalStorage()
        }
    }

    removeReception(id: number): void {
        this.receptions = this.receptions.filter(r => r.id !== id)
        this.saveLocalStorage()
    }

    saveLocalStorage() {
        saveToStorage(this.receptions)
        this.notify()
    }

    load() {
        this.receptions = loadFromStorage()
        let changed = false;
        this.receptions.forEach(r => {
            if (shouldUpdateTaken(r)) {
                r.taken = false;
                r.lastTakenUpdate = new Date().toISOString();
                changed = true
            }

            if (r.archive === false && isDatePassed(r.dateEnd)) {
                r.archive = true
                changed = true
            }
        })
        if (changed) this.saveLocalStorage()
    }
}