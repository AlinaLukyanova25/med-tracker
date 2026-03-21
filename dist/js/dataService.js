import { loadFromStorage, saveToStorage } from "./storage.js";
export class DataService {
    constructor() {
        this.receptions = [];
        this.load();
    }
    getReceprions() {
        return this.receptions;
    }
    addReception(reception) {
        this.receptions.push(reception);
        this.saveLocalStorage();
    }
    removeReception(id) {
        this.receptions = this.receptions.filter(r => r.id !== id);
        this.saveLocalStorage();
    }
    saveLocalStorage() {
        saveToStorage(this.receptions);
    }
    load() {
        this.receptions = loadFromStorage();
    }
}
