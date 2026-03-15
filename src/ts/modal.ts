import { getElement } from "./types.js";

export class ModalManager {
    private modalForm: HTMLDivElement;

    constructor() {
        this.modalForm = getElement<HTMLDivElement>('modal')

        this.init()
    }

    init() {
        document.addEventListener('click', (e) => this.handleAddButtonClick(e))
        document.addEventListener('click', (e) => this.closeModal(e))
    }

    handleAddButtonClick(e: Event) {
        const target = e.target as HTMLElement

        const addButton: HTMLButtonElement | null = target.closest('.add-button')
        if (!addButton) return

        this.modalForm.classList.remove('hidden')
        this.modalForm.innerHTML = this.createModalFormComponent()
    }

    closeModal(e: Event) {
        const target = e.target as HTMLElement
        if (target.closest('.modal') && !target.closest('.modal__content') || target.closest('.modal__close')) {
            this.modalForm.classList.add('hidden')
        }
    }

    private createModalFormComponent(): string {
        return `
        <div class="modal__content">
            <span class="modal__close">&times;</span>
            <h3 class="list-title">Добавить приём</h3>
            <form id="add-reception">
                <label for="reception-name">Название лекарства</label>
                <input type="text" id="reception-name" placeholder="Введите название" required>
                <label for="reception-dosage">Дозировка</label>
                <input type="number" id="reception-dosage" placeholder="Введите в мг" min="0" step="0.1" required>
                <label for="reception-stock">Запас таблеток</label>
                <input type="number" id="reception-stock" placeholder="Введите количество, напр. 20" min="0" required>
                <label for="reception-end">Окончание приема</label>
                <input type="date" id="reception-end" required>
                <button type="submit" class="item-button">Добавить</button>
            </form>
        </div>
        `
    }
}