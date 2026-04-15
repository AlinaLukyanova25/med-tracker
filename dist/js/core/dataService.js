import { loadFromStorage, loadFromStorageDates, saveToStorage, saveToStorageDates } from "./storage.js";
import { isDatePassed, shouldUpdateTaken } from "./dateUtils.js";
import { getActiveDateSet } from "./sortUtils.js";
export class DataService {
    constructor() {
        this.diseases = [];
        this.markedDates = [];
        this.listeners = [];
        this.load();
        this.loadMarkedDates();
    }
    getDiseases() {
        return this.diseases;
    }
    getSetDiseasesDate() {
        return getActiveDateSet(this.getDiseases());
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
    getMarkedDates() {
        return this.markedDates;
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
    addMarkedDate(markedDate) {
        this.markedDates.push(markedDate);
        this.saveLocalStorageDates();
    }
    findDisease(id) {
        return this.diseases.find(d => d.id === id);
    }
    findDiseaseWithMed(id) {
        return this.diseases
            .find(d => d.medArray.find(med => med.medId === id));
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
    findMarkedDates(date) {
        return this.markedDates.find(md => md.date === date);
    }
    updateDisease(id, updater) {
        const dis = this.diseases.find(d => d.id === id);
        if (dis) {
            updater(dis);
            this.saveLocalStorage();
        }
    }
    updateMedication(id, updater) {
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
    updateMarkedDate(date, updater) {
        const md = this.markedDates.find(m => m.date === date);
        if (md) {
            updater(md);
            this.saveLocalStorageDates();
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
    saveLocalStorageDates() {
        saveToStorageDates(this.markedDates);
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
                if (shouldUpdateTaken(med.lastTakenUpdate)) {
                    med.takenTimes = [];
                    med.lastTakenUpdate = new Date().toISOString();
                    changed = true;
                }
            });
        });
        if (changed)
            this.saveLocalStorage();
    }
    loadMarkedDates() {
        const stored = loadFromStorageDates();
        const activeDates = this.getSetDiseasesDate();
        const now = new Date();
        let changed = false;
        this.markedDates = stored.filter(md => {
            if (!activeDates.has(md.date))
                return false;
            if (shouldUpdateTaken(md.lastTakenUpdate)) {
                md.lastTakenUpdate = new Date().toISOString();
                changed = true;
            }
            return true;
        });
        if (changed)
            this.saveLocalStorageDates();
    }
}
