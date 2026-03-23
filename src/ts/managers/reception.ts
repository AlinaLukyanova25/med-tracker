import { getElement, querySelectorEl, Reception } from "../types/types.js";
import { ModalManager } from "./modal.js";
import { renderActiveList } from "../ui/renderService.js";
import { DataService } from "../core/dataService.js";
import { DateUtils } from "../core/timeUtils.js";

export class ReceptionManager {
    private times: string[] = [];
    private activeList: HTMLUListElement;
    private addForm: HTMLFormElement;
    private diseaseName: HTMLInputElement;
    private medicationName: HTMLInputElement;
    private time: HTMLInputElement;
    private timeLabel: HTMLLabelElement;
    private dosage: HTMLInputElement;
    private stock: HTMLInputElement;
    private dateEnd: HTMLInputElement;
    private dataService: DataService;
    private addAgain: HTMLFormElement;
    private againDateEnd: HTMLInputElement;
    private modal: ModalManager

    constructor(modal: ModalManager, dataService: DataService) {
        this.activeList = querySelectorEl<HTMLUListElement>('.active__list');
        this.addForm = getElement<HTMLFormElement>('add-reception');
        this.diseaseName = getElement<HTMLInputElement>('disease-name');
        this.medicationName = getElement<HTMLInputElement>('medication-name');
        this.time = getElement<HTMLInputElement>('reception-time');
        this.timeLabel = getElement<HTMLLabelElement>('time-label');
        this.dosage = getElement<HTMLInputElement>('reception-dosage');
        this.stock = getElement<HTMLInputElement>('reception-stock');
        this.dateEnd = getElement<HTMLInputElement>('reception-end');
        
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
        renderActiveList(this.dataService.getReceptions(), this.activeList)
    }

    setupEventListeners() {
        console.log('Обработчик submit в reception')
        this.addForm.addEventListener('submit', (e) => this.handleAddFormSubmit(e))
        this.addAgain.addEventListener('submit', (e) => this.handleAgainFormSubmit(e))

        this.activeList.addEventListener('click', (e) => this.removeReceptionCard(e))

        this.timeLabel.addEventListener('click', (e) => this.handleLabelTimeClick(e))
    }

    handleAddFormSubmit(e: Event) {
        e.preventDefault()

        const disName = this.diseaseName.value.trim()
        const medName = this.medicationName.value.trim()
        const dosage = Number(this.dosage.value)
        const stock = Number(this.stock.value)
        const dateEnd = new Date(this.dateEnd?.value)
        const time = this.time.value

        if (!disName || !medName) {
            alert('Введите корректные названия')
            return
        }

        if (isNaN(dateEnd.getTime())) {
            alert('Укажите корректную дату окончания')
            return
        }

        if (!time && this.times.length === 0) {
            alert('Введите время приёма')
            return
        }

        if (time) this.times.push(time)

        const reception: Reception = {
            id: Date.now(),
            diseaseName: disName,
            medicationName: medName,
            time: this.times,
            dosage: dosage,
            stock: stock,
            dateStart: new Date(),
            dateEnd: dateEnd,
            taken: false,
            archive: false,
            lastTakenUpdate: new Date().toISOString()
        }

        this.dataService.addReception(reception)
        this.times = [];
        this.modal.addHidden('modal')
        this.addForm.reset()
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

        this.dataService.updateReception(Number(id), (rec) => {
            rec.dateEnd = dateEnd;
            rec.archive = false;
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

    removeReceptionCard(e: Event) {
        const target = e.target as HTMLElement

        const button = target.closest('.active__card-delete')
        if (!button) return

        const dataId = button.getAttribute('data-id')
        if (!dataId) return

        this.dataService.removeReception(Number(dataId))
    }

    
}