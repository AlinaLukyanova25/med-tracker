import { getElement, querySelectorEl, SelectMedicationType, SelectPowderType } from "../types/types.js";
import { Disease, Medication, MedicationType } from "../types/common";
import { ModalManager } from "./modal.js";
import { renderActiveList } from "../ui/renderService.js";
import { DataService } from "../core/dataService.js";
import { DateUtils } from "../core/timeUtils.js";

export class DiseasesManager {
    private times: string[] = [];
    private medArray: MedicationType[] = [];
    private activeList: HTMLUListElement;
    private addForm: HTMLFormElement;
    private diseaseName: HTMLInputElement;
    private medicationName: HTMLInputElement;
    private time: HTMLInputElement;
    private timeLabel: HTMLLabelElement;

    private selectType: HTMLSelectElement;

    private labelPowderType: HTMLLabelElement;
    private selectPowderType: HTMLSelectElement;

    private labelDosage: HTMLLabelElement;
    private dosage: HTMLInputElement;
    private labelStock: HTMLLabelElement;
    private stock: HTMLInputElement;

    private dateEnd: HTMLInputElement;
    private dataService: DataService;
    private addAgain: HTMLFormElement;
    private againDateEnd: HTMLInputElement;

    private modal: ModalManager
    private moreMedButton: HTMLButtonElement;

    constructor(modal: ModalManager, dataService: DataService) {
        this.activeList = querySelectorEl<HTMLUListElement>('.active__list');
        this.addForm = getElement<HTMLFormElement>('add-reception');
        this.diseaseName = getElement<HTMLInputElement>('disease-name');
        this.medicationName = getElement<HTMLInputElement>('medication-name');
        this.time = getElement<HTMLInputElement>('reception-time');
        this.timeLabel = getElement<HTMLLabelElement>('time-label');

        this.selectType = getElement<HTMLSelectElement>('medication-type');

        this.labelPowderType = getElement<HTMLLabelElement>('label-powder-type');
        this.selectPowderType = getElement<HTMLSelectElement>('powder-type');

        this.labelDosage = getElement<HTMLLabelElement>('dosage-label');
        this.dosage = getElement<HTMLInputElement>('reception-dosage');
        this.labelStock = getElement<HTMLLabelElement>('stock-label');
        this.stock = getElement<HTMLInputElement>('reception-stock');
        this.dateEnd = getElement<HTMLInputElement>('reception-end');
        this.moreMedButton = querySelectorEl<HTMLButtonElement>('.modal__more-btn');
        
        this.addAgain = getElement<HTMLFormElement>('add-again')
        this.againDateEnd = getElement<HTMLInputElement>('reception-again-end')

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
        console.log('Обработчик submit в reception')
        this.addForm.addEventListener('submit', (e) => this.handleAddFormSubmit(e))

        this.timeLabel.addEventListener('click', (e) => this.handleLabelTimeClick(e))

        this.moreMedButton.addEventListener('click', (e) => this.handleAddMoreMedication(e))

        this.addAgain.addEventListener('submit', (e) => this.handleAgainFormSubmit(e))

        this.selectType.addEventListener('change', () => this.chooseTypeMedication())

        this.selectPowderType.addEventListener('change', () => this.chooseDosageType())
    }

    handleAddFormSubmit(e: Event) {
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
            alert('Введите корректное болезни')
            return
        }

        if (isNaN(dateEnd.getTime())) {
            alert('Укажите корректную дату окончания')
            return
        }

        if (!medArray && this.medArray.length === 0 || medName || dosage || stock || time) {
            if (!medName) {
                alert('Введите корректное название лекарства')
            }

            if (!time && this.times.length === 0) {
                alert('Введите время приёма')
                return
            }

            if (time) this.times.push(time)
            
            const medication = this.createMedicationOnType(
                medType as SelectMedicationType,
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
    }

    handleAddMoreMedication(e: Event) {
        e.preventDefault()

        const disName = this.diseaseName.value.trim()
        const medName = this.medicationName.value.trim()
        const dosage = Number(this.dosage.value)
        const stock = Number(this.stock.value)
        const dateEnd = this.dateEnd?.value
        const time = this.time.value
        const medType = this.selectType.value

        if (!disName || !medName) {
            alert('Введите корректные названия')
            return
        }

        if (!time && this.times.length === 0) {
            alert('Введите время приёма')
            return
        }

        if (time) this.times.push(time)
        
        const medication: MedicationType | undefined = this.createMedicationOnType(
            medType as SelectMedicationType,
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
        const base = {
            medId: crypto.randomUUID(),
            medicationName,
            time,
            takenTimes: [],
            lastTakenUpdate: new Date().toISOString(),
        }
        switch (medType) {
            case SelectMedicationType.Pill:
                if (!dosage || !stock) return this.showError()
                return { ...base, type: 'Таблетка', dosage, stock }
            case SelectMedicationType.Capsule:
                if (!dosage || !stock) return this.showError()
                return { ...base, type: 'Капсула', dosage, stock }
            case SelectMedicationType.Mixture:
                if (!dosage) return this.showError()
                return { ...base, type: 'Микстура', dosage }
            case SelectMedicationType.Drops:
                if (!dosage) return this.showError()
                return { ...base, type: 'Капли', dosage }
            case SelectMedicationType.Aerosol:
                return { ...base, type: 'Аэрозоль' }
            case SelectMedicationType.Ointment:
                return { ...base, type: 'Мазь' }
            case SelectMedicationType.Powder:
                if (this.selectPowderType.value === SelectPowderType.Sachet) {
                    if (!dosage || !stock) return this.showError()
                    return { ...base, type: 'Порошок', dosageType: 'Пакетик', dosage, stock }
                } else {
                    if (!dosage) return this.showError()
                    return { ...base, type: 'Порошок', dosageType: 'Ложка', dosage }
                }
        }
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
        const valueType = this.selectType.value as SelectMedicationType
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

    showError(): undefined {
        alert('Введите все значения')
        return
    }

    handleAgainFormSubmit(e: Event) {
        e.preventDefault()

        const dateEnd = new Date(this.againDateEnd.value)

        if (isNaN(dateEnd.getTime())) {
            alert('Укажите корректную дату окончания')
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
    }

    handleLabelTimeClick(e: Event) {
        const target = e.target as HTMLElement

        const addMore = target.closest('.modal__add-more')
        if (!addMore) return

        if (!this.time.value) return

        alert(this.time.value)

        this.times.push(this.time.value)

        console.log(this.times)

        this.time.value = ''
    }
}