import { loadFromStorage, loadFromStorageDates, saveToStorage, saveToStorageDates } from "./storage.js";
import { isDatePassed, shouldUpdateTaken } from "./dateUtils.js";
import { Disease, MedicationType } from "../types/data";
import { MarkedDates } from "../types/ui"
import { getActiveDateSet } from "./sortUtils.js";

export class DataService {
    private diseases: Disease[] = [];
    private markedDates: MarkedDates[] = []
    private listeners: (() => void)[] = [];

    constructor() {
        this.load()
        this.loadMarkedDates()
    }

    getDiseases(): Disease[] {
        return this.diseases
    }

    getSetDiseasesDate(): Set<string> {
        return getActiveDateSet(this.getDiseases())
    }

    getAllMedications(): MedicationType[] {
        const newArr: MedicationType[] = []

        for (let dis of this.diseases) {
            if (dis.archive) continue
            for (let med of dis.medArray) {
                newArr.push(med)
            }
        }

        return newArr
    }

    getMarkedDates(): MarkedDates[] {
        return this.markedDates
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

    addMarkedDate(markedDate: MarkedDates) {
        this.markedDates.push(markedDate)
        this.saveLocalStorageDates()
    }

    findDisease(id: number): Disease | undefined {
        return this.diseases.find(d => d.id === id)
    }

    findDiseaseWithMed(id: string): Disease | undefined {
        return this.diseases
        .find(d => d.medArray.find(med => med.medId === id))
    }

    findMedicationWithDis(disId: number, medId: string): MedicationType | undefined {
        return this.diseases
            .find(d => d.id === disId)
            ?.medArray
            .find(m => m.medId === medId)
    }

    findMedication(medId: string): MedicationType | undefined {
        let med: MedicationType | undefined
        this.diseases
            .forEach(d => {
                const item = d.medArray.find(m => m.medId === medId)
                if (item) med = item
            })
        return med
    }

    findMarkedDates(date: string): MarkedDates | undefined {
        return this.markedDates.find(md => md.date === date)
    }

    updateDisease(id: number, updater: (dis: Disease) => void) {
        const dis = this.diseases.find(d => d.id === id)
        if (dis) {
            updater(dis)
            this.saveLocalStorage()
        }
    }

    updateMedication(id: string, updater: (med: MedicationType) => void) {
        let med: MedicationType | undefined
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

    updateMarkedDate(date: string, updater: (md: MarkedDates) => void) {
        const md = this.markedDates.find(m => m.date === date)
        if (md) {
            updater(md)
            this.saveLocalStorageDates()
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

    saveLocalStorageDates() {
        saveToStorageDates(this.markedDates)
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
                    if (shouldUpdateTaken(med.lastTakenUpdate)) {
                        med.takenTimes = [];
                        med.lastTakenUpdate = new Date().toISOString();
                        changed = true
                    }
                });
            })
        if (changed) this.saveLocalStorage()
    }
    
    loadMarkedDates() {
        const stored = loadFromStorageDates()
        const activeDates = this.getSetDiseasesDate()
        const now = new Date()
        let changed = false;

        this.markedDates = stored.filter(md => {
            if (!activeDates.has(md.date)) return false

            if (shouldUpdateTaken(md.lastTakenUpdate)) {
                md.lastTakenUpdate = new Date().toISOString();
                changed = true
            }
            return true
        })
        if (changed) this.saveLocalStorageDates()
    }
}