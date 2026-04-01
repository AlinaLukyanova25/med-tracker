import { loadFromStorage, saveToStorage } from "./storage.js";
import { isDatePassed, shouldUpdateTaken } from "./timeUtils.js";
export class DataService {
    constructor() {
        this.diseases = [];
        this.listeners = [];
        this.load();
    }
    getDiseases() {
        return this.diseases;
    }
    getAllMedications() {
        const newArr = [];
        for (let dis of this.diseases) {
            if (dis.archive)
                continue;
            for (let med of dis.medArray) {
                newArr.push(med);
            }
        }
        return newArr;
    }
    subscribe(callback) {
        this.listeners.push(callback);
    }
    notify() {
        this.listeners.forEach(cb => cb());
        console.log(`Хранение ${this.listeners}`);
    }
    addDisease(disease) {
        this.diseases.push(disease);
        this.saveLocalStorage();
    }
    findDisease(id) {
        return this.diseases.find(d => d.id === id);
    }
    findMedicationWithDis(disId, medId) {
        var _a;
        return (_a = this.diseases
            .find(d => d.id === disId)) === null || _a === void 0 ? void 0 : _a.medArray.find(m => m.medId === medId);
    }
    findMedication(medId) {
        let med;
        this.diseases
            .forEach(d => {
            const item = d.medArray.find(m => m.medId === medId);
            if (item)
                med = item;
        });
        return med;
    }
    updateDisease(id, updater) {
        let med;
        this.diseases
            .forEach(d => {
            const item = d.medArray.find(m => m.medId === id);
            if (item)
                med = item;
        });
        if (med) {
            updater(med);
            this.saveLocalStorage();
        }
    }
    removeDiseases(id) {
        this.diseases = this.diseases.filter(d => d.id !== id);
        this.saveLocalStorage();
    }
    removeMedication(id) {
        this.diseases
            .forEach(d => {
            d.medArray = d.medArray.filter(m => m.medId !== id);
        });
        this.saveLocalStorage();
    }
    saveLocalStorage() {
        saveToStorage(this.diseases);
        this.notify();
    }
    load() {
        this.diseases = loadFromStorage();
        let changed = false;
        this.diseases.forEach(d => {
            if (d.archive === false && isDatePassed(d.dateEnd)) {
                d.archive = true;
                changed = true;
            }
            d.medArray.forEach(med => {
                if (shouldUpdateTaken(med)) {
                    med.takenTimes = [];
                    med.lastTakenUpdate = new Date().toISOString();
                    changed = true;
                }
            });
        });
        if (changed)
            this.saveLocalStorage();
    }
}
