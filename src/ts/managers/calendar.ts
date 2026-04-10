import { DataService } from "../core/dataService.js"
import { getActiveDateSet } from "../core/sortUtils.js"
import { formatDate, formatDateRu, isDatePassed, shouldUpdateTaken } from "../core/timeUtils.js"
import { getElement, querySelectorEl } from "../types/types.js"
import { ModalManager } from "./modal.js"

export class CalendarManager {
    private currentDate: Date = new Date()
    private dataService: DataService

    private receptionList: HTMLUListElement
    private missedList: HTMLUListElement;

    private calendarContainer: HTMLDivElement;
    private modal: ModalManager;

    constructor(dataService: DataService, modal: ModalManager) {
        this.dataService = dataService
        this.calendarContainer = getElement<HTMLDivElement>('calendar');

        this.receptionList = querySelectorEl<HTMLUListElement>('.reception-list');
        this.missedList = querySelectorEl<HTMLUListElement>('.missed-list');

        this.modal = modal

        this.init()
    }

    init() {
        this.setupEventLisneters()

        this.dataService.subscribe(() => {
            this.renderCalendar()
        })

        this.renderCalendar()
    }

    updateMonthHeader() {
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        const currentMonthEl = getElement<HTMLHeadingElement>('current-month')
        const monthName = monthNames[this.currentDate.getMonth()]
        const year = this.currentDate.getFullYear()
        currentMonthEl.textContent = `${monthName} ${year}`
    }

    renderCalendar() {
        this.calendarContainer.innerHTML = ''

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0)
        const dayInMonth = lastDay.getDate()

        const startingDay = firstDay.getDay();
        const startOffset = startingDay === 0 ? 6 : startingDay - 1;

        const endDay = lastDay.getDay()
        const endOffset = endDay === 0 ? 6 : endDay - 1;

        for (let day = 0; day < startOffset; day++) {
            const dayElement = this.createDayComponent()

            this.calendarContainer.insertAdjacentHTML('beforeend', dayElement)
        }

        for (let day = 1; day <= dayInMonth; day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day)

            const dayElement = this.createDayComponent(date, day)

            this.calendarContainer.insertAdjacentHTML('beforeend', dayElement)
        }

        for (let day = endOffset; day < 6; day++) {
            const dayElement = this.createDayComponent()

            this.calendarContainer.insertAdjacentHTML('beforeend', dayElement)
        }

        this.updateMonthHeader()
    }

    createDayComponent(date?: Date, day?: number): string {
        if (!date || !day) {
            return `
            <div tabindex="0" class="calendar__day" style="color: gray;">
            </div>
            `
        }

        const dayNumber = date.getDate()

        const dateToString = formatDate(date)

        const isHasDate = this.dataService.getSetDiseasesDate().has(dateToString)

        const markedDate = this.dataService.findMarkedDates(dateToString)

        return `
        <div tabindex="0" class="calendar__day ${
            markedDate && markedDate.taken
            ? 'accepted'
            : isHasDate && isDatePassed(date) && (!markedDate || !markedDate.taken)
                ? 'no-accepted' 
                : isHasDate 
                    ? 'disease'
                    : ''
        }" style="color: #1e293b;" data-date="${dateToString}">
        ${dayNumber}
        </div>
        `
    }

    handleCalendarDayClick(e: Event) {
        const target = e.target as HTMLElement

        const cardDay = target.closest('.calendar__day')
        if (!cardDay) return

        if (cardDay.classList.contains('accepted')) return
        
        const dataDate = cardDay.getAttribute('data-date')
        if (!dataDate) return

        if (shouldUpdateTaken(dataDate)) return

        if (!this.dataService.getSetDiseasesDate().has(dataDate)) return

        if (
            this.receptionList.querySelectorAll('.reception-list__item').length !== 0 ||
            this.missedList.querySelectorAll('.missed-list__item').length !== 0
        ) {
            this.modal.openModalWarning('Вы ещё не приняли все лекарства на сегодня')
        } else {
            if (this.dataService.findMarkedDates(dataDate)) {
                this.dataService.updateMarkedDate(dataDate, (md) => {
                    md.taken = true
                })
            } else {
                this.dataService.addMarkedDate({
                    date: dataDate,
                    taken: true,
                    lastTakenUpdate: new Date().toISOString(),
                })
            }
        }
    }

    changeMonth(direction: number) {
        this.currentDate.setDate(1)
        this.currentDate.setMonth(this.currentDate.getMonth() + direction)
        this.renderCalendar()
    }

    setupEventLisneters() {
        this.calendarContainer.addEventListener('click', (e) => this.handleCalendarDayClick(e))

        getElement<HTMLButtonElement>('prev-month').addEventListener('click', () => this.changeMonth(-1))
        getElement<HTMLButtonElement>('next-month').addEventListener('click', () => this.changeMonth(1))
    }
}