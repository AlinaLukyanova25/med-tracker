import { getElement, querySelectorEl, Reception } from "./types.js";
import { saveToStorage, loadFromStorage } from "./storage.js";
import { ModalManager } from "./modal.js";

export class ReceptionManager {
    private receptions: Reception[] = [];
    private activeList: HTMLUListElement;
    private addForm: HTMLFormElement;
    private diseaseName: HTMLInputElement;
    private medicationName: HTMLInputElement;
    private dosage: HTMLInputElement;
    private stock: HTMLInputElement;
    private dateEnd: HTMLInputElement;
    private modal: ModalManager

    constructor(modal: ModalManager) {
        this.activeList = querySelectorEl<HTMLUListElement>('.active__list');
        this.addForm = getElement<HTMLFormElement>('add-reception');
        this.diseaseName = getElement<HTMLInputElement>('disease-name');
        this.medicationName = getElement<HTMLInputElement>('medication-name');
        this.dosage = getElement<HTMLInputElement>('reception-dosage');
        this.stock = getElement<HTMLInputElement>('reception-stock');
        this.dateEnd = getElement<HTMLInputElement>('reception-end');
        this.modal = modal
        
        this.receptions = loadFromStorage()
        this.init()
    }

    init() {
        this.setupEventListeners()
        this.renderReceptions()
    }

    setupEventListeners() {
        console.log('Обработчик submit в reception')
        this.addForm.addEventListener('submit', (e) => this.handleAddFormSubmit(e))

        this.activeList.addEventListener('click', (e) => this.removeReceptionCard(e))
    }

    handleAddFormSubmit(e: Event) {
        e.preventDefault()

        const disName = this.diseaseName.value.trim()
        const medName = this.medicationName.value.trim()
        const dosage = Number(this.dosage.value)
        const stock = Number(this.stock.value)
        const dateEnd = new Date(this.dateEnd?.value)

        if (!disName || !medName) {
            alert('Введите корректные названия')
            return
        }

        if (isNaN(dateEnd.getTime())) {
            alert('Укажите корректную дату окончания')
            return
        }

        const reception: Reception = {
            id: Date.now(),
            diseaseName: disName,
            medicationName: medName,
            dosage: dosage,
            stock: stock,
            dateStart: new Date(),
            dateEnd: dateEnd
        }

        this.receptions.push(reception)
        console.log(this.receptions)
        saveToStorage(this.receptions)
        this.renderReceptions()
        this.modal.addHidden()
        this.addForm.reset()
    }

    renderReceptions() {
        this.activeList.innerHTML = ''

        if (this.receptions.length === 0) {
            this.activeList.innerHTML = '<p class="item-title descr-not">Пока нет активных приёмов</p>'
            return
        }

        for (let reception of this.receptions) {
            const li = this.createReceptionComponent(reception)
            this.activeList.insertAdjacentHTML('beforeend', li)
        }
    }

    createReceptionComponent(reception: Reception): string {
        return `
        <li class="active__card">
            <h3 class="list-title">${reception.diseaseName}</h3>
            <h4 class="item-title">${reception.medicationName}</h4>
            <p class="active__date">
                <span class="active__date--start">Назначен: ${this.formatDateRu(reception.dateStart)}</span>
                <span class="active__date--end">Окончание приёма: ${this.formatDateRu(reception.dateEnd)}</span>
            </p>
            <div class="active__card-bottom">
                <p class="active__dosage">Доза: <span>${reception.dosage} мг.</span></p>
                <p class="active__time">Время приёма: <span>Утро</span></p>
                <button class="item-button active__card-delete" data-id="${reception.id}">Удалить приём</button>
            </div>
        </li>
        `
    }

    formatDateRu(date: Date): string {
        return date.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' });
    }

    removeReceptionCard(e: Event) {
        const target = e.target as HTMLElement

        const button = target.closest('.active__card-delete')
        if (!button) return

        const dataId = button.getAttribute('data-id')
        if (!dataId) return

        this.receptions = this.receptions.filter(reception => reception.id !== Number(dataId))
        saveToStorage(this.receptions)
        this.renderReceptions()
    }
}