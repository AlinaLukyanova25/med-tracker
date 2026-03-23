import { loadFromStorage, saveToStorage } from "./storage.js";
import { isDatePassed, shouldUpdateTaken } from "./timeUtils.js";
export class DataService {
    constructor() {
        this.receptions = [];
        this.listeners = [];
        this.load();
    }
    getReceptions() {
        return this.receptions;
    }
    subscribe(callback) {
        this.listeners.push(callback);
    }
    notify() {
        this.listeners.forEach(cb => cb());
        console.log(`Хранение ${this.listeners}`);
    }
    addReception(reception) {
        this.receptions.push(reception);
        this.saveLocalStorage();
    }
    updateReception(id, updater) {
        const rec = this.receptions.find(r => r.id === id);
        if (rec) {
            updater(rec);
            this.saveLocalStorage();
        }
    }
    removeReception(id) {
        this.receptions = this.receptions.filter(r => r.id !== id);
        this.saveLocalStorage();
    }
    saveLocalStorage() {
        saveToStorage(this.receptions);
        this.notify();
    }
    load() {
        this.receptions = loadFromStorage();
        let changed = false;
        this.receptions.forEach(r => {
            if (shouldUpdateTaken(r)) {
                r.taken = false;
                r.lastTakenUpdate = new Date().toISOString();
                changed = true;
            }
            if (r.archive === false && isDatePassed(r.dateEnd)) {
                r.archive = true;
                changed = true;
            }
        });
        if (changed)
            this.saveLocalStorage();
    }
}
