import { loadFromStorage, saveToStorage } from "./storage.js";
import { Reception } from "./types.js";

export class DataService {
    private receptions: Reception[] = [];

    constructor() {
        this.load()
    }

    getReceprions(): Reception[] {
        return this.receptions
    }

    addReception(reception: Reception): void {
        this.receptions.push(reception)
        this.saveLocalStorage()
    }

    removeReception(id: number): void {
        this.receptions = this.receptions.filter(r => r.id !== id)
        this.saveLocalStorage()
    }

    saveLocalStorage() {
        saveToStorage(this.receptions)
    }

    load() {
        this.receptions = loadFromStorage()
    }
}