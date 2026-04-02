import { loadFromStorage, saveToStorage } from "./storage.js";
import { isDatePassed, shouldUpdateTaken } from "./timeUtils.js";
import { Disease, Medication } from "../types/common";

export class DataService {
    private diseases: Disease[] = [];
    private listeners: (() => void)[] = [];

    constructor() {
        this.load()
    }

    getDiseases(): Disease[] {
        return this.diseases
    }

    getAllMedications(): Medication[] {
        const newArr: Medication[] = []

        for (let dis of this.diseases) {
            if (dis.archive) continue
            for (let med of dis.medArray) {
                newArr.push(med)
            }
        }

        return newArr
    }

    subscribe(callback: () => void) {
        this.listeners.push(callback)
    }

    private notify() {
        this.listeners.forEach(cb => cb());
        console.log(`Хранение ${this.listeners}`)
    }

    addDisease(disease: Disease): void {
        this.diseases.push(disease)
        this.saveLocalStorage()
    }

    findDisease(id: number): Disease | undefined {
        return this.diseases.find(d => d.id === id)
    }

    findMedicationWithDis(disId: number, medId: string): Medication | undefined {
        return this.diseases
            .find(d => d.id === disId)
            ?.medArray
            .find(m => m.medId === medId)
    }

    findMedication(medId: string): Medication | undefined {
        let med: Medication | undefined
        this.diseases
            .forEach(d => {
                const item = d.medArray.find(m => m.medId === medId)
                if (item) med = item
            })
        return med
    }

    updateDisease(id: string, updater: (med: Medication) => void) {
        let med: Medication | undefined
        this.diseases
            .forEach(d => {
                const item = d.medArray.find(m => m.medId === id)
                if (item) med = item
            })
        if (med) {
            updater(med)
            this.saveLocalStorage()
        }
    }

    removeDiseases(id: number): void {
        this.diseases = this.diseases.filter(d => d.id !== id)
        this.saveLocalStorage()
    }

    removeMedication(id: string): void {
        this.diseases
            .forEach(d => {
                d.medArray = d.medArray.filter(m => m.medId !== id)
            })
        this.saveLocalStorage()
    }

    saveLocalStorage() {
        saveToStorage(this.diseases)
        this.notify()
    }

    load() {
        this.diseases = loadFromStorage()
            let changed = false;
        this.diseases.forEach(d => {
            if (d.archive === false && isDatePassed(d.dateEnd)) {
                d.archive = true
                changed = true
            }
                d.medArray.forEach(med => {
                    if (shouldUpdateTaken(med)) {
                        med.takenTimes = [];
                        med.lastTakenUpdate = new Date().toISOString();
                        changed = true
                    }
                });
            })
        if (changed) this.saveLocalStorage()
    }
}