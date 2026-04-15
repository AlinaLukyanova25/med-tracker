import { SelectMedicationType, SelectPowderType, collectsObjectByType, isValidMedicationType } from "../types/types.js";
import { Disease, MedicationType } from "../types/data.js";
import { ModalManager } from "./modal.js";
import { renderActiveList } from "../ui/renderService.js";
import { DataService } from "../core/dataService.js";
import { createTakenTimesArray, DateUtils, formatDate, getTimeReception } from "../core/dateUtils.js";
import { domElements } from "../core/domElements.js";

export class DiseasesManager {
    private times: string[] = [];
    private medArray: MedicationType[] = [];

    private activeList = domElements.activeList;
    private addForm: HTMLFormElement = domElements.disease.addForm;
    private diseaseName: HTMLInputElement = domElements.disease.diseaseName;
    private medicationName: HTMLInputElement = domElements.disease.medicationName;
    private time: HTMLInputElement = domElements.disease.time;
    private timeLabel: HTMLLabelElement = domElements.disease.timeLabel;

    private selectType: HTMLSelectElement = domElements.disease.selectType;

    private labelPowderType: HTMLLabelElement = domElements.disease.labelPowderType;
    private selectPowderType: HTMLSelectElement = domElements.disease.selectPowderType;

    private labelDosage: HTMLLabelElement = domElements.disease.labelDosage;
    private dosage: HTMLInputElement = domElements.disease.dosage;
    private labelStock: HTMLLabelElement = domElements.disease.labelStock;
    private stock: HTMLInputElement = domElements.disease.stock;

    private dateEnd: HTMLInputElement = domElements.disease.dateEnd;
    private dataService: DataService;
    private addAgain: HTMLFormElement = domElements.disease.addAgain;
    private againDateEnd: HTMLInputElement = domElements.disease.againDateEnd;

    private modal: ModalManager
    private moreMedButton: HTMLButtonElement = domElements.disease.moreMedButton;

    private receptionList = domElements.receptionList;
    private missedList = domElements.missedList;

    constructor(modal: ModalManager, dataService: DataService) {

        this.modal = modal
        this.dataService = dataService
    
        this.init()
    }

    init() {
        this.setupEventListeners()

        DateUtils.setMinDate(this.dateEnd)
        DateUtils.setMinDate(this.againDateEnd)

        this.dataService.subscribe(() => {
            this.render()
        })

        this.render()
    }

    render() {
        renderActiveList(this.dataService.getDiseases(), this.activeList)
    }

    setupEventListeners() {
        this.addForm.addEventListener('submit', (e) => this.handleAddFormSubmit(e))

        this.timeLabel.addEventListener('click', (e) => this.handleLabelTimeClick(e))

        this.moreMedButton.addEventListener('click', (e) => this.handleAddMoreMedication(e))

        this.addAgain.addEventListener('submit', (e) => this.handleAgainFormSubmit(e))

        this.selectType.addEventListener('change', () => this.chooseTypeMedication())

        this.selectPowderType.addEventListener('change', () => this.chooseDosageType())
    }

    handleAddFormSubmit(e: SubmitEvent) {
        e.preventDefault()

        const disName = this.diseaseName.value.trim()
        const medName = this.medicationName.value.trim()
        const dosage = Number(this.dosage.value)
        const stock = Number(this.stock.value)
        const dateEnd = new Date(this.dateEnd?.value)
        const time = this.time.value
        const medArray = this.medArray.length
        const medType = this.selectType.value

        if (!disName) {
            this.modal.openModalWarning('Введите корректное болезни')
            return
        }

        if (isNaN(dateEnd.getTime())) {
            this.modal.openModalWarning('Укажите корректную дату окончания')
            return
        }

        if (!medArray && this.medArray.length === 0 || medName || dosage || stock || time) {
            if (!medName) {
                this.modal.openModalWarning('Введите корректное название лекарства')
            }

            if (!time && this.times.length === 0) {
                this.modal.openModalWarning('Введите время приёма')
                return
            }

            if (time) this.times.push(time)
            
            if (!isValidMedicationType(medType)) return
            
            const medication = this.createMedicationOnType(
                medType,
                medName,
                this.times,
                dosage,
                stock
            )
            if (!medication) return
        
            this.medArray.push(medication)

            this.times = [];

            this.labelPowderType.style.display = 'none'
            this.selectPowderType.style.display = 'none'

            this.labelDosage.style.display = 'block'
            this.dosage.style.display = 'block'
            this.dosage.placeholder = 'Введите в таблетках'
            this.labelStock.style.display = 'block'
            this.stock.style.display = 'block'
        }

        const disease: Disease = {
            id: Date.now(),
            diseaseName: disName,
            dateStart: new Date(),
            dateEnd: dateEnd,
            archive: false,
            medArray: this.medArray
        }

        this.dataService.addDisease(disease)
        this.medArray = []
        this.modal.addHidden('modal')
        this.addForm.reset()
        this.checkMainPage()
    }

    handleAddMoreMedication(e: MouseEvent) {
        e.preventDefault()

        this.medicationName.focus()

        const disName = this.diseaseName.value.trim()
        const medName = this.medicationName.value.trim()
        const dosage = Number(this.dosage.value)
        const stock = Number(this.stock.value)
        const dateEnd = this.dateEnd?.value
        const time = this.time.value
        const medType = this.selectType.value

        if (!disName || !medName) {
            this.modal.openModalWarning('Введите корректные названия')
            return
        }

        if (!time && this.times.length === 0) {
            this.modal.openModalWarning('Введите время приёма')
            return
        }

        if (time) this.times.push(time)
        
        if (!isValidMedicationType(medType)) return
        
        const medication: MedicationType | undefined = this.createMedicationOnType(
            medType,
            medName,
            this.times,
            dosage,
            stock
        )
        if (!medication) return

        this.medArray.push(medication)
        this.times = [];

        this.time.value = ''
        this.medicationName.value = ''
        this.dosage.value = ''
        this.stock.value = ''

        this.chooseTypeMedication()
    }

    createMedicationOnType(
        medType: SelectMedicationType,
        medicationName: string,
        time: string[],
        dosage: number,
        stock: number
    ): MedicationType | undefined {
        const acceptedArray = createTakenTimesArray(time)

        
        const base = collectsObjectByType(
            medicationName,
            time,
            acceptedArray,
            medType,
            this.selectPowderType.value,
            dosage,
            stock,
            this.modal
        )

        return base ? base : undefined
    }

    private medicationConfig() {
        return {
            [SelectMedicationType.Pill]: { dosage: true, stock: true, placeholder: 'Введите в таблетках' },
            [SelectMedicationType.Capsule]: { dosage: true, stock: true, placeholder: 'Введите в капсулах' },
            [SelectMedicationType.Mixture]: { dosage: true, stock: false, placeholder: 'Введите в мер.ложках' },
            [SelectMedicationType.Drops]: { dosage: true, stock: false, placeholder: 'Введите в каплях' },
            [SelectMedicationType.Aerosol]: { dosage: false, stock: false },
            [SelectMedicationType.Ointment]: { dosage: false, stock: false },
            [SelectMedicationType.Powder]: { special: true },
        }
    }

    chooseTypeMedication() {
        const valueType = this.selectType.value

        if (!isValidMedicationType(valueType)) return

        const config = this.medicationConfig()[valueType]
        if (!config) return

        this.labelPowderType.style.display = 'none'
        this.selectPowderType.style.display = 'none'
        if ('dosage' in config) {
            this.labelDosage.style.display = config.dosage ? 'block' : 'none'
            this.dosage.style.display = config.dosage ? 'block' : 'none'
        }
        if ('stock' in config) {
            this.labelStock.style.display = config.stock ? 'block' : 'none'
            this.stock.style.display = config.stock ? 'block' : 'none'
        }
        if ('placeholder' in config) this.dosage.placeholder = config.placeholder

        if (valueType === SelectMedicationType.Powder) {
            this.labelPowderType.style.display = 'block'
            this.selectPowderType.style.display = 'block'
            this.chooseDosageType()
        }
    }

    chooseDosageType() {
        const valueTyle = this.selectPowderType.value

        switch (valueTyle) {
            case SelectPowderType.Sachet:
                this.labelDosage.style.display = 'block'
                this.dosage.style.display = 'block'
                this.dosage.placeholder = 'Введите в пакетиках'
                this.labelStock.style.display = 'block'
                this.stock.style.display = 'block'
                break
            case SelectPowderType.Spoon:
                this.labelDosage.style.display = 'block'
                this.dosage.style.display = 'block'
                this.dosage.placeholder = 'Введите в мер.ложках'
                this.labelStock.style.display = 'none'
                this.stock.style.display = 'none'
        }
    }

    handleAgainFormSubmit(e: SubmitEvent) {
        e.preventDefault()

        const dateEnd = new Date(this.againDateEnd.value)

        if (isNaN(dateEnd.getTime())) {
            this.modal.openModalWarning('Укажите корректную дату окончания')
            return
        }

        const id = this.addAgain.getAttribute('data-id')
        if (!id) return

        this.dataService.updateDisease(Number(id), (dis) => {
            dis.dateStart = new Date()
            dis.dateEnd = dateEnd;
            dis.archive = false;
        })

        this.modal.addHidden('again')
        this.addAgain.reset()
        this.checkMainPage()
    }

    handleLabelTimeClick(e: MouseEvent) {
        const target = e.target

        if (!(target instanceof HTMLElement)) return

        const addMore = target.closest('.modal__add-more')
        if (!addMore) return

        if (!this.time.value) return

        this.times.push(this.time.value)

        this.time.value = ''
    }

    checkMainPage() {
        const markedDate = this.dataService.findMarkedDates(formatDate(new Date()))
        if (!markedDate) return
        if (!markedDate.taken) return

        if (
            this.receptionList.querySelectorAll('.reception-list__item').length !== 0 ||
            this.missedList.querySelectorAll('.missed-list__item').length !== 0
        ) {
            this.dataService.updateMarkedDate(markedDate.date, (md) => {
                md.taken = false
            })
        }
    }
}